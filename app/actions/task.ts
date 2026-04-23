"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to add a task.");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  const deadline = formData.get("deadline") as string; 

  const { error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: user.id,
        title,
        type: type || "General",
        priority: priority || "Medium",
        deadline: deadline ? new Date(deadline).toISOString() : null,
        status: "pending",
        sort_order: 0,
      },
    ]);

  if (error) {
    console.error("Error adding task:", error);
    throw new Error("Failed to add task");
  }

  revalidatePath("/");
}
