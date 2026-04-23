import { createClient } from "@/utils/supabase/server";
import { MoodSelector } from "@/components/MoodSelector";
import { PageWrapper } from "@/components/PageWrapper";
import { DashboardClient } from "@/components/DashboardClient";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch pending tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Fetch classes
  const { data: classes } = await supabase
    .from("student_schedule")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const name = user.email?.split("@")[0] || "Rozzyne";

  return (
    <PageWrapper>
      <header style={styles.header}>
        <h1 style={styles.title}>Good Morning, {name}!</h1>
        <p style={styles.subtitle}>How is your energy right now?</p>
      </header>

      <MoodSelector />

      <DashboardClient initialTasks={tasks || []} classes={classes || []} />
    </PageWrapper>
  );
}

const styles = {
  header: { marginBottom: "30px" },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "5px", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: "16px" },
};
