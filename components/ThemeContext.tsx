"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  hue: number;
  setHue: (hue: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [hue, setHue] = useState<number>(240); // Default to calm blue

  useEffect(() => {
    // Update the CSS variable whenever hue changes
    document.documentElement.style.setProperty("--primary-hue", hue.toString());
  }, [hue]);

  return (
    <ThemeContext.Provider value={{ hue, setHue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
