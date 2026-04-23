"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

export async function zyncSchedule(hue: number, label: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Log the mood
  await supabase.from("mood_logs").insert([{ user_id: user.id, hue_value: hue, label }]);

  // 2. Fetch all pending tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, type, priority, deadline")
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (!tasks || tasks.length === 0) return;

  // 3. Fetch today's classes
  const dayOfWeek = new Date().getDay(); // 0-6
  const { data: classes } = await supabase
    .from("student_schedule")
    .select("*")
    .eq("user_id", user.id)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  // 4. Call Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
    You are Zync, an emotionally intelligent calendar AI. 
    Current Date: ${new Date().toISOString()}
    Current Mood: ${label} (Hue: ${hue}).
    
    Pending Tasks: ${JSON.stringify(tasks)}
    Today's Fixed Classes: ${JSON.stringify(classes)}
    
    Your job is to build a daily schedule.
    1. Estimate how long each task takes based on its title and type.
    2. Assign a \`scheduled_start\` and \`scheduled_end\` (ISO 8601 strings for TODAY) for each task.
    3. DO NOT overlap tasks with each other or with Fixed Classes. Assume waking hours are 08:00 to 22:00.
    4. Upgrade the \`new_priority\` to "Critical" or "High" if a deadline is approaching very soon.
    5. Order them chronologically.
    
    Return ONLY a JSON array of objects. Do not include any markdown formatting or extra text. Just the raw JSON array.
    Format exactly like this:
    [
      { "id": "task-uuid", "new_priority": "Critical", "scheduled_start": "2026-04-23T09:00:00Z", "scheduled_end": "2026-04-23T10:00:00Z" }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || "[]";
    if (text.startsWith("\`\`\`json")) text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    else if (text.startsWith("\`\`\`")) text = text.replace(/\`\`\`/g, "").trim();
    
    const sortedTasks: any[] = JSON.parse(text);

    // 5. Update the tasks with times in the database
    for (let i = 0; i < sortedTasks.length; i++) {
      await supabase
        .from("tasks")
        .update({ 
          sort_order: i,
          priority: sortedTasks[i].new_priority,
          scheduled_start: sortedTasks[i].scheduled_start,
          scheduled_end: sortedTasks[i].scheduled_end
        })
        .eq("id", sortedTasks[i].id)
        .eq("user_id", user.id);
    }

    revalidatePath("/");
  } catch (err) {
    console.error("AI Zync failed:", err);
    throw new Error("Failed to dynamically Zync schedule.");
  }
}
