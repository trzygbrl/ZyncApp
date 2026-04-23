import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Zync | Mood-Based Planner",
  description: "AI-driven daily planner that schedules based on your energy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <main className="app-container">
            {children}
          </main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
