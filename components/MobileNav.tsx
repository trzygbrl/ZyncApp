"use client";

import { Home, Plus, User } from "lucide-react";
import { motion } from "framer-motion";

export function MobileNav() {
  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <button style={styles.iconButton}>
          <Home size={24} />
        </button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.fab}
        >
          <Plus size={32} color="#fff" />
        </motion.button>

        <button style={styles.iconButton}>
          <User size={24} />
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "var(--bg-card)",
    borderTop: "1px solid var(--border-color)",
    paddingBottom: "env(safe-area-inset-bottom)",
    zIndex: 50,
  },
  navContent: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "70px",
    maxWidth: "600px",
    margin: "0 auto",
    position: "relative" as const,
  },
  iconButton: {
    color: "var(--text-muted)",
    padding: "10px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  fab: {
    backgroundColor: "var(--primary-color)",
    width: "56px",
    height: "56px",
    borderRadius: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 20px var(--primary-glow)",
    transform: "translateY(-20px)",
  }
};
