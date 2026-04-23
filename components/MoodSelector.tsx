"use client";

import { useTheme } from "@/components/ThemeContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { zyncSchedule } from "@/app/actions/ai";

export function MoodSelector() {
  const { hue, setHue } = useTheme();
  const [loading, setLoading] = useState(false);

  const moods = [
    { label: "Energetic", color: 30 }, // Orange
    { label: "Calm", color: 240 }, // Blue
    { label: "Focused", color: 280 }, // Purple
    { label: "Anxious", color: 190 }, // Teal
    { label: "Burned Out", color: 0 }, // Red
  ];

  const handleZync = async () => {
    setLoading(true);
    const activeMood = moods.find(m => m.color === hue) || moods[1];
    
    try {
      await zyncSchedule(activeMood.color, activeMood.label);
    } catch(err) {
      console.error(err);
      alert("AI Sync failed! Make sure you added the GEMINI_API_KEY in .env.local");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div style={styles.moodGrid}>
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
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleZync}
        disabled={loading}
        style={{...styles.zyncBtn, opacity: loading ? 0.7 : 1}}
      >
        {loading ? "✨ Zyncing Schedule..." : "✨ Zync My Schedule"}
      </motion.button>
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
  zyncBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "var(--primary-color)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    border: "none",
    boxShadow: "0 4px 15px var(--primary-glow)",
    cursor: "pointer",
    marginBottom: "20px",
  }
};
