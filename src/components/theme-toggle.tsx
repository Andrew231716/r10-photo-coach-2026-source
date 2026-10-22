"use client";

import { Moon, Sun } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";

export function ThemeToggle() {
  const { ready, theme, setTheme } = useAppState();
  if (!ready) return null;

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="grid size-10 place-items-center border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--paper)]"
      aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
