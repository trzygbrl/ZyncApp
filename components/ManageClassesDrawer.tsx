"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { addClass, deleteClass } from "@/app/actions/schedule";

export function ManageClassesDrawer({ classes, onClose }: { classes: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addClass(formData);
      setTimeout(() => window.location.reload(), 500);
    } catch(err) {
      alert("Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} style={styles.backdrop} 
      />
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={styles.drawer}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>Your Fixed Schedule</h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
        </div>

        <div style={styles.list}>
          {classes.length === 0 && <p style={{color: "var(--text-muted)"}}>No classes added yet.</p>}
          {classes.map(c => (
            <div key={c.id} style={styles.classItem}>
              <div>
                <strong style={{color: "var(--text-main)"}}>{c.title}</strong>
                <p style={{fontSize: "12px", color: "var(--text-muted)", marginTop: "4px"}}>
                  {days[c.day_of_week]} • {c.start_time.slice(0,5)} - {c.end_time.slice(0,5)}
                </p>
              </div>
              <button onClick={async () => {
                await deleteClass(c.id);
                window.location.reload();
              }} style={styles.deleteBtn}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <h3 style={{marginTop: "30px", marginBottom: "15px", fontSize: "16px"}}>Add New Class</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="title" placeholder="Class Name (e.g. Calculus)" required style={styles.input} />
          
          <div style={styles.field}>
            <label style={styles.label}>Day of Week</label>
            <select name="day_of_week" style={styles.input} required>
              {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>

          <div style={{display: "flex", gap: "10px"}}>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>Start Time</label>
              <input type="time" name="start_time" required style={styles.input} />
            </div>
            <div style={{...styles.field, flex: 1}}>
              <label style={styles.label}>End Time</label>
              <input type="time" name="end_time" required style={styles.input} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Saving..." : "Add Class"}
          </button>
        </form>
      </motion.div>
    </>
  );
}

const styles = {
  backdrop: { position: "fixed" as const, top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100 },
  drawer: { position: "fixed" as const, bottom: 0, left: 0, width: "100%", backgroundColor: "var(--bg-color)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", padding: "24px", paddingBottom: "40px", zIndex: 101, boxShadow: "0 -4px 30px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto" as const },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "20px", fontWeight: "bold" },
  closeBtn: { color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column" as const, gap: "10px", maxHeight: "200px", overflowY: "auto" as const, marginBottom: "20px" },
  classItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" },
  deleteBtn: { background: "none", border: "none", color: "#ff4757", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column" as const, gap: "15px" },
  field: { display: "flex", flexDirection: "column" as const, gap: "8px" },
  label: { fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" },
  input: { padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-main)", outline: "none", fontSize: "16px" },
  submitBtn: { marginTop: "10px", padding: "18px", borderRadius: "16px", backgroundColor: "var(--primary-color)", color: "#fff", fontWeight: "bold", fontSize: "16px", border: "none", cursor: "pointer" }
};
