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

  // 3. Call Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
    You are Zync, an emotionally intelligent scheduler. 
    The user's current mood is: ${label} (Hue: ${hue}).
    Here are their pending tasks: ${JSON.stringify(tasks)}.
    
    If they are burned out or anxious, prioritize low-effort or administrative tasks to build momentum.
    If they are energetic or focused, prioritize critical or deep work tasks.
    Also consider deadlines (closer deadlines should generally be higher, but mood takes priority).

    Return ONLY a JSON array of task IDs in the optimal order from first to last. Do not include any markdown formatting or extra text. Just the raw JSON array.
    Example: ["id-1", "id-2", "id-3"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || "[]";
    // Clean up if it returned markdown
    if (text.startsWith("\`\`\`json")) {
        text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (text.startsWith("\`\`\`")) {
        text = text.replace(/\`\`\`/g, "").trim();
    }
    
    const sortedIds: string[] = JSON.parse(text);

    // 4. Update the sort_order in the database
    for (let i = 0; i < sortedIds.length; i++) {
      await supabase
        .from("tasks")
        .update({ sort_order: i })
        .eq("id", sortedIds[i])
        .eq("user_id", user.id);
    }

    revalidatePath("/");
  } catch (err) {
    console.error("AI Zync failed:", err);
    throw new Error("Failed to dynamically Zync schedule.");
  }
}
