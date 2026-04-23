"use client";

import { useState } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { TaskList } from "./TaskList";
import { ManageClassesDrawer } from "./ManageClassesDrawer";
import { Book } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function DashboardClient({ initialTasks, classes }: { initialTasks: any[], classes: any[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);

  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  // Filter tasks for the selected date
  const scheduledTasks = initialTasks.filter(t => {
    if (!t.scheduled_start) return false;
    return isSameDay(new Date(t.scheduled_start), selectedDate);
  });

  const unscheduledTasks = initialTasks.filter(t => !t.scheduled_start);

  return (
    <div style={styles.container}>
      {/* Date Carousel */}
      <div style={styles.dateCarousel}>
        {days.map(day => (
          <button 
            key={day.toISOString()} 
            onClick={() => setSelectedDate(day)}
            style={{
              ...styles.datePill,
              backgroundColor: isSameDay(day, selectedDate) ? "var(--primary-color)" : "var(--bg-card)",
              color: isSameDay(day, selectedDate) ? "#fff" : "var(--text-main)",
            }}
          >
            <div style={styles.dateName}>{day.toLocaleDateString([], {weekday: 'short'})}</div>
            <div style={styles.dateNumber}>{day.getDate()}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Your Timeline</h2>
        <button 
          onClick={() => setIsClassDrawerOpen(true)} 
          style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "13px", padding: "8px 14px", borderRadius: "12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-main)", cursor: "pointer", fontWeight: "bold" }}
        >
          <Book size={14} /> Manage Classes
        </button>
      </div>

      <CalendarGrid tasks={scheduledTasks} classes={classes} selectedDate={selectedDate} />

      <h2 style={styles.sectionTitle}>Task Backlog</h2>
      {unscheduledTasks.length > 0 ? (
        <TaskList initialTasks={unscheduledTasks} />
      ) : (
        <p style={styles.emptyText}>No unscheduled tasks!</p>
      )}

      <AnimatePresence>
        {isClassDrawerOpen && <ManageClassesDrawer classes={classes} onClose={() => setIsClassDrawerOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { marginTop: "20px" },
  dateCarousel: { display: "flex", gap: "10px", overflowX: "auto" as const, paddingBottom: "10px", WebkitOverflowScrolling: "touch" },
  datePill: { padding: "10px 15px", borderRadius: "16px", border: "1px solid var(--border-color)", minWidth: "60px", textAlign: "center" as const, cursor: "pointer", transition: "all 0.2s" },
  dateName: { fontSize: "12px", opacity: 0.8 },
  dateNumber: { fontSize: "18px", fontWeight: "bold" },
  sectionTitle: { fontSize: "20px", marginBottom: "15px", fontWeight: "bold", marginTop: "30px" },
  emptyText: { color: "var(--text-muted)", fontStyle: "italic", textAlign: "center" as const },
};
