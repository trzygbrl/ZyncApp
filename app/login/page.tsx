"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/PageWrapper";
import { useTheme } from "@/components/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    
    // We get the current origin to pass as the redirectURL
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      setMessage({ text: error.message, error: true });
    } else {
      setMessage({ text: "Check your email for the magic link!", error: false });
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <div style={styles.container}>
        <div style={styles.iconWrapper}>
          {/* A simple glowing circle as our temporary logo */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 4 }} 
            style={styles.logo} 
          />
        </div>
        
        <h1 style={styles.title}>Welcome to Zync</h1>
        <p style={styles.subtitle}>Enter your email to receive a magic link.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Sending link..." : "Send Magic Link"}
          </motion.button>
        </form>

        {message && (
          <p style={{ ...styles.message, color: message.error ? "#ff6b6b" : "var(--primary-color)" }}>
            {message.text}
          </p>
        )}
      </div>
    </PageWrapper>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    padding: "20px",
    textAlign: "center" as const,
  },
  iconWrapper: {
    marginBottom: "30px",
  },
  logo: {
    width: "80px",
    height: "80px",
    borderRadius: "40px",
    background: "var(--primary-color)",
    boxShadow: "0 0 40px var(--primary-glow)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "var(--text-muted)",
    marginBottom: "40px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    maxWidth: "320px",
    gap: "15px",
  },
  input: {
    padding: "16px",
    borderRadius: "var(--border-radius)",
    border: "2px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-main)",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "16px",
    borderRadius: "var(--border-radius)",
    backgroundColor: "var(--primary-color)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 15px var(--primary-glow)",
  },
  message: {
    marginTop: "20px",
    fontWeight: "500",
  }
};
