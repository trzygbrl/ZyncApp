"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addClass(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const day_of_week = parseInt(formData.get("day_of_week") as string);
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;

  const { error } = await supabase
    .from("student_schedule")
    .insert([
      {
        user_id: user.id,
        title,
        day_of_week,
        start_time,
        end_time,
      },
    ]);

  if (error) {
    console.error(error);
    throw new Error("Failed to add class");
  }

  revalidatePath("/");
}

export async function deleteClass(classId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("student_schedule").delete().eq("id", classId).eq("user_id", user.id);
  revalidatePath("/");
}
