"use client";

import { Moon, Sun } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";
import type { ThemePreference } from "@/lib/app-state";

function paintTheme(theme: ThemePreference) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try { localStorage.setItem("r10-theme", theme); } catch { /* ignore */ }
}

export function ThemeToggle() {
  const { ready, theme, setTheme } = useAppState();
  if (!ready) {
    return <span className="size-10 border border-[var(--chrome-line)] opacity-0" aria-hidden="true" />;
  }

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        paintTheme(next);
        setTheme(next);
      }}
      className="relative z-[80] grid size-10 place-items-center border border-[var(--chrome-line)] text-[var(--chrome-muted)] transition hover:border-[var(--chrome-line-strong)] hover:text-[var(--chrome-paper)]"
      aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
      aria-pressed={theme === "light"}
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
