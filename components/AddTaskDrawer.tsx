"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { addTask } from "@/app/actions/task";

export function AddTaskDrawer({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("priority", priority);
    
    try {
      await addTask(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={styles.backdrop} 
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={styles.drawer}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>New Task</h2>
          <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            name="title" 
            placeholder="What needs to be done?" 
            required 
            autoFocus
            style={styles.inputLarge} 
          />

          <div style={styles.field}>
            <label style={styles.label}>Type</label>
            <input 
              type="text" 
              name="type" 
              placeholder="e.g. Deep Work, Chore, Admin..." 
              style={styles.input} 
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <div style={styles.pillGroup}>
              {["Low", "Medium", "High", "Critical"].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    ...styles.pill,
                    backgroundColor: priority === p ? "var(--primary-color)" : "transparent",
                    color: priority === p ? "#fff" : "var(--text-main)",
                    borderColor: priority === p ? "var(--primary-color)" : "var(--border-color)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </motion.div>
    </>
  );
}

const styles = {
  backdrop: {
    position: "fixed" as const,
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 100,
  },
  drawer: {
    position: "fixed" as const,
    bottom: 0, left: 0, width: "100%",
    backgroundColor: "var(--bg-color)",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    padding: "24px",
    paddingBottom: "40px",
    zIndex: 101,
    boxShadow: "0 -4px 30px rgba(0,0,0,0.5)",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px",
  },
  title: { fontSize: "20px", fontWeight: "bold" },
  closeBtn: { color: "var(--text-muted)", background: "none", border: "none" },
  form: { display: "flex", flexDirection: "column" as const, gap: "25px" },
  inputLarge: {
    fontSize: "24px", border: "none", backgroundColor: "transparent", color: "var(--text-main)", outline: "none", fontWeight: "bold"
  },
  field: { display: "flex", flexDirection: "column" as const, gap: "10px" },
  label: { fontSize: "14px", color: "var(--text-muted)", fontWeight: "500" },
  input: {
    padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-main)", outline: "none", fontSize: "16px"
  },
  pillGroup: { display: "flex", gap: "10px", flexWrap: "wrap" as const },
  pill: {
    padding: "10px 18px", borderRadius: "20px", border: "1px solid", fontSize: "14px", fontWeight: "600", transition: "all 0.2s",
  },
  submitBtn: {
    marginTop: "10px", padding: "18px", borderRadius: "16px", backgroundColor: "var(--primary-color)", color: "#fff", fontWeight: "bold", fontSize: "18px", textAlign: "center" as const, boxShadow: "0 4px 15px var(--primary-glow)", border: "none"
  }
};
