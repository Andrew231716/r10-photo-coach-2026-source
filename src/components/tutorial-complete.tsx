"use client";

import { Check, Trophy } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";

export function TutorialComplete({ slug }: { slug: string }) {
  const { ready, tutorialsCompleted, toggleTutorial } = useAppState();
  const complete = tutorialsCompleted.includes(slug);

  return (
    <button onClick={() => toggleTutorial(slug)} disabled={!ready} className={`flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${complete ? "border border-[var(--success)]/60 text-[var(--success)]" : "bg-[var(--signal)] text-[var(--ink)] hover:bg-[var(--signal-strong)]"}`}>
      {complete ? <Check size={17} /> : <Trophy size={17} />}{complete ? "Tutorial completato" : "Segna come completato · +80 XP"}
    </button>
  );
}
