"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { useTheme } from "@/components/ThemeContext";
import { motion } from "framer-motion";

export default function Home() {
  const { hue, setHue } = useTheme();

  const moods = [
    { label: "Energetic", color: 30 }, // Orange
    { label: "Calm", color: 240 }, // Blue
    { label: "Focused", color: 280 }, // Purple
    { label: "Anxious", color: 190 }, // Teal
    { label: "Burned Out", color: 0 }, // Red
  ];

  return (
    <PageWrapper>
      <header style={styles.header}>
        <h1 style={styles.title}>Good Morning, Rozzyne!</h1>
        <p style={styles.subtitle}>How is your energy right now?</p>
      </header>

      <section style={styles.moodGrid}>
        {moods.map((mood) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              ...styles.moodCard,
              borderColor: hue === mood.color ? `hsl(${mood.color}, 70%, 60%)` : "var(--border-color)",
              backgroundColor: hue === mood.color ? `hsla(${mood.color}, 70%, 60%, 0.1)` : "var(--bg-card)",
            }}
            onClick={() => setHue(mood.color)}
          >
            {mood.label}
          </motion.button>
        ))}
      </section>

      <section style={styles.dashboard}>
        <h2 style={styles.sectionTitle}>Today's Plan</h2>
        <div style={styles.taskCard}>
          <div style={styles.taskDot} />
          <div style={styles.taskInfo}>
            <h3 style={styles.taskTitle}>Build Zync Frontend</h3>
            <p style={styles.taskType}>Deep Work • High Priority</p>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

const styles = {
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "5px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: "16px",
  },
  moodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    marginBottom: "40px",
  },
  moodCard: {
    padding: "15px 10px",
    borderRadius: "var(--border-radius)",
    border: "2px solid var(--border-color)",
    textAlign: "center" as const,
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s, border-color 0.3s",
  },
  dashboard: {
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "15px",
  },
  taskCard: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "var(--border-radius)",
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
    backgroundColor: "var(--primary-color)",
    boxShadow: "0 0 10px var(--primary-glow)",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  taskType: {
    fontSize: "12px",
    color: "var(--text-muted)",
  }
};
