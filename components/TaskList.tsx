"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { completeTask } from "@/app/actions/task";
import { Edit2 } from "lucide-react";
import { EditTaskDrawer } from "./EditTaskDrawer";

export function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState<any>(null);

  const handleComplete = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await completeTask(taskId);
    } catch (err) {
      console.error(err);
      alert("Failed to complete task.");
      window.location.reload(); 
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <AnimatePresence>
        {tasks.map(task => (
          <motion.div 
            layout
            key={task.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: -80 }}
            transition={{ duration: 0.3 }}
            style={styles.taskCard}
          >
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={() => handleComplete(task.id)}
              style={styles.checkbox}
            />

            <div style={styles.taskInfo} onClick={() => setEditingTask(task)}>
              <div style={styles.titleRow}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <Edit2 size={14} color="var(--text-muted)" style={{ cursor: "pointer" }} />
              </div>
              <p style={styles.taskType}>
                <span style={{ color: getPriorityColor(task.priority), fontWeight: "bold" }}>
                  {task.priority}
                </span>
                {' • '}{task.type}
                {task.deadline && ` • Due: ${new Date(task.deadline).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}`}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask && (
          <EditTaskDrawer 
            task={editingTask} 
            onClose={() => setEditingTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
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
  taskCard: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid var(--border-color)",
  },
  checkbox: {
    width: "28px",
    height: "28px",
    borderRadius: "14px",
    border: "2px solid var(--border-color)",
    backgroundColor: "transparent",
    cursor: "pointer",
    flexShrink: 0,
  },
  taskInfo: { flex: 1, cursor: "pointer" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  taskTitle: { fontSize: "16px", fontWeight: "bold" },
  taskType: { fontSize: "13px", color: "var(--text-muted)" },
};
