"use client";

import { motion, AnimatePresence } from "framer-motion";
import { completeTask } from "@/app/actions/task";
import { useState, useEffect } from "react";
import { EditTaskDrawer } from "./EditTaskDrawer";

function timeToPixels(timeString: string, startHour: number = 8, pixelsPerHour: number = 70) {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours + (minutes / 60) - startHour) * pixelsPerHour;
}

export function CalendarGrid({ tasks, classes, selectedDate }: { tasks: any[], classes: any[], selectedDate: Date }) {
  const startHour = 6; 
  const endHour = 24; 
  const pixelsPerHour = 80;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  const [localTasks, setLocalTasks] = useState(tasks);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleComplete = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setLocalTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await completeTask(taskId);
    } catch (err) {
      window.location.reload();
    }
  };

  const dayOfWeek = selectedDate.getDay();
  const activeClasses = classes.filter(c => c.day_of_week === dayOfWeek);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.timeColumn}>
          {hours.map(h => (
            <div key={h} style={{ height: pixelsPerHour, position: "relative" }}>
              <span style={styles.timeLabel}>{h === 12 ? "12 PM" : h === 24 ? "12 AM" : h > 12 ? `${h - 12} PM` : `${h} AM`}</span>
            </div>
          ))}
        </div>
        <div style={styles.grid}>
          {hours.map(h => (
            <div key={h} style={{ height: pixelsPerHour, borderBottom: "1px solid var(--border-color)" }} />
          ))}
          
          <AnimatePresence>
            {localTasks.map(task => {
              const top = timeToPixels(task.scheduled_start, startHour, pixelsPerHour);
              const endTop = timeToPixels(task.scheduled_end, startHour, pixelsPerHour);
              const height = Math.max(endTop - top, 45); 
              
              return (
                <motion.div
                  layout
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setEditingTask(task)}
                  style={{
                    ...styles.taskBlock,
                    top,
                    height,
                    backgroundColor: getPriorityColor(task.priority, 0.2),
                    borderColor: getPriorityColor(task.priority, 1),
                  }}
                >
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                    <h4 style={styles.blockTitle}>{task.title}</h4>
                    <button onClick={(e) => handleComplete(e, task.id)} style={{...styles.checkbox, borderColor: getPriorityColor(task.priority, 1)}}></button>
                  </div>
                  <p style={styles.blockTime}>
                    {new Date(task.scheduled_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                    {new Date(task.scheduled_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {activeClasses.map(cls => {
            const todayStr = selectedDate.toISOString().split("T")[0];
            const top = timeToPixels(`${todayStr}T${cls.start_time}`, startHour, pixelsPerHour);
            const endTop = timeToPixels(`${todayStr}T${cls.end_time}`, startHour, pixelsPerHour);
            const height = endTop - top;

            return (
              <div key={cls.id} style={{ ...styles.classBlock, top, height }}>
                <h4 style={styles.classTitle}>{cls.title} (Class)</h4>
                <p style={{fontSize: "11px", color: "var(--text-muted)"}}>
                   {cls.start_time.slice(0,5)} - {cls.end_time.slice(0,5)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {editingTask && <EditTaskDrawer task={editingTask} onClose={() => setEditingTask(null)} />}
      </AnimatePresence>
    </>
  );
}

function getPriorityColor(priority: string, alpha: number = 1) {
  switch (priority.toLowerCase()) {
    case 'critical': return `hsla(355, 100%, 64%, ${alpha})`; 
    case 'high': return `hsla(39, 100%, 50%, ${alpha})`; 
    case 'medium': return `hsla(var(--primary-hue), var(--saturation), 60%, ${alpha})`; 
    case 'low': return `hsla(145, 63%, 52%, ${alpha})`; 
    default: return `hsla(var(--primary-hue), var(--saturation), 60%, ${alpha})`;
  }
}

const styles = {
  container: {
    display: "flex",
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    height: "500px",
    overflowY: "auto" as const,
    position: "relative" as const,
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
  },
  timeColumn: {
    width: "50px",
    borderRight: "1px solid var(--border-color)",
    paddingTop: "0px", 
  },
  timeLabel: {
    position: "absolute" as const,
    top: "-8px",
    right: "10px",
    fontSize: "10px",
    color: "var(--text-muted)",
    fontWeight: "500",
  },
  grid: {
    flex: 1,
    position: "relative" as const,
  },
  taskBlock: {
    position: "absolute" as const,
    left: "10px",
    right: "10px",
    borderRadius: "10px",
    borderLeft: "4px solid",
    padding: "8px 12px",
    overflow: "hidden",
    zIndex: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    borderRadius: "11px",
    border: "2px solid",
    backgroundColor: "transparent",
    cursor: "pointer",
    flexShrink: 0,
  },
  classBlock: {
    position: "absolute" as const,
    left: "0",
    right: "0",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderTop: "1px dashed var(--border-color)",
    borderBottom: "1px dashed var(--border-color)",
    padding: "8px 20px",
    overflow: "hidden",
    zIndex: 5,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
  },
  blockTitle: { fontSize: "14px", fontWeight: "bold", marginBottom: "2px", color: "var(--text-main)" },
  classTitle: { fontSize: "14px", fontWeight: "bold", color: "var(--text-muted)", opacity: 0.8 },
  blockTime: { fontSize: "11px", color: "var(--text-main)", opacity: 0.8 }
};
