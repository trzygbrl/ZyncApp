import { createClient } from "@/utils/supabase/server";
import { MoodSelector } from "@/components/MoodSelector";
import { PageWrapper } from "@/components/PageWrapper";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If we are here, middleware verified auth, but just in case
  if (!user) return null;

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Extract a friendly name from email
  const name = user.email?.split("@")[0] || "Rozzyne";

  return (
    <PageWrapper>
      <header style={styles.header}>
        <h1 style={styles.title}>Good Morning, {name}!</h1>
        <p style={styles.subtitle}>How is your energy right now?</p>
      </header>

      <MoodSelector />

      <section style={styles.dashboard}>
        <h2 style={styles.sectionTitle}>Your Tasks</h2>
        <div style={styles.taskList}>
          {tasks && tasks.length > 0 ? (
            tasks.map((task: any) => (
              <div key={task.id} style={styles.taskCard}>
                <div style={{...styles.taskDot, backgroundColor: getPriorityColor(task.priority)}} />
                <div style={styles.taskInfo}>
                  <h3 style={styles.taskTitle}>{task.title}</h3>
                  <p style={styles.taskType}>{task.type} • {task.priority} Priority</p>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Your schedule is totally clear!</p>
              <p style={styles.emptySubtext}>Tap the + button below to start planning.</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'critical': return '#ff4757';
    case 'high': return '#ffa502';
    case 'medium': return 'var(--primary-color)';
    case 'low': return '#2ed573';
    default: return 'var(--primary-color)';
  }
}

const styles = {
  header: { marginBottom: "30px" },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "5px", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: "16px" },
  dashboard: { marginTop: "40px" },
  sectionTitle: { fontSize: "20px", marginBottom: "20px", fontWeight: "bold" },
  taskList: { display: "flex", flexDirection: "column" as const, gap: "15px" },
  taskCard: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid var(--border-color)",
  },
  taskDot: {
    width: "12px",
    height: "12px",
    borderRadius: "6px",
    boxShadow: "0 0 10px rgba(255,255,255,0.1)",
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: "16px", fontWeight: "bold", marginBottom: "4px" },
  taskType: { fontSize: "13px", color: "var(--text-muted)" },
  emptyState: { padding: "40px 20px", textAlign: "center" as const, backgroundColor: "var(--bg-card)", borderRadius: "16px", border: "1px dashed var(--border-color)" },
  emptyText: { color: "var(--text-main)", fontWeight: "bold", fontSize: "16px", marginBottom: "8px" },
  emptySubtext: { color: "var(--text-muted)", fontSize: "14px" }
};
