"use client";

import { useTheme } from "@/components/ThemeContext";
import { motion } from "framer-motion";

export function MoodSelector() {
  const { hue, setHue } = useTheme();

  const moods = [
    { label: "Energetic", color: 30 }, // Orange
    { label: "Calm", color: 240 }, // Blue
    { label: "Focused", color: 280 }, // Purple
    { label: "Anxious", color: 190 }, // Teal
    { label: "Burned Out", color: 0 }, // Red
  ];

  return (
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
  );
}

const styles = {
  moodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  moodCard: {
    padding: "15px 10px",
    borderRadius: "16px",
    border: "2px solid var(--border-color)",
    textAlign: "center" as const,
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s, border-color 0.3s",
    cursor: "pointer",
  },
};
