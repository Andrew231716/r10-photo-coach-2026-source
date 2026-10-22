"use client";

import { Moon, Sun } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";
import type { ThemePreference } from "@/lib/app-state";

function paintTheme(theme: ThemePreference) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("theme-light", theme === "light");
  root.classList.toggle("theme-dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem("r10-theme", theme);
  } catch {
    /* ignore quota / private mode */
  }
}

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "row" }) {
  const { ready, theme, setTheme } = useAppState();
  if (!ready) {
    return variant === "icon"
      ? <span className="size-10 border border-[var(--chrome-line)] opacity-0" aria-hidden="true" />
      : null;
  }

  const next: ThemePreference = theme === "dark" ? "light" : "dark";
  const apply = () => {
    paintTheme(next);
    setTheme(next);
  };

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={apply}
        className="flex min-h-11 w-full items-center justify-between gap-3 border border-[var(--chrome-line)] px-3 text-sm text-[var(--chrome-paper)] transition hover:border-[var(--chrome-line-strong)]"
        aria-pressed={theme === "light"}
      >
        <span>{theme === "dark" ? "Tema scuro" : "Tema chiaro"}</span>
        <span className="inline-flex items-center gap-2 text-[var(--chrome-muted)]">
          {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          Cambia
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={apply}
      className="relative z-[80] grid size-10 place-items-center border border-[var(--chrome-line)] text-[var(--chrome-muted)] transition hover:border-[var(--chrome-line-strong)] hover:text-[var(--chrome-paper)]"
      aria-label={theme === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
      aria-pressed={theme === "light"}
      data-testid="theme-toggle"
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
