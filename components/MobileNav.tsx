"use client";

import { useState, useEffect } from "react";
import { Home, Plus, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddTaskDrawer } from "./AddTaskDrawer";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render nav on the login page
  if (pathname === '/login') return null;
  if (!mounted) return null;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <button style={styles.iconButton}>
            <Home size={24} />
          </button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.fab}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus size={32} color="#fff" />
          </motion.button>

          <button style={styles.iconButton}>
            <User size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <AddTaskDrawer onClose={() => setIsDrawerOpen(false)} />
        )}
      </AnimatePresence>
    </>
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
    background: "none",
    border: "none",
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
    border: "none",
  }
};
