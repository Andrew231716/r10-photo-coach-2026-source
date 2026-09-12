"use client";

import { Check, Clock3, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useAppState } from "@/components/app-state-provider";
import { academyLevels } from "@/data/academy";
import { getAcademyXp, totalAcademyModules, totalAcademyXp } from "@/lib/academy-metrics";

export function AcademyProgress() {
  const { academyCompleted: completed, ready, storageMode } = useAppState();
  const percentage = Math.round((completed.length / totalAcademyModules) * 100);
  const xp = getAcademyXp(completed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 border border-[var(--line)] bg-[var(--panel)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--signal)]">Percorso completo</p><h2 className="font-display mt-2 text-2xl font-semibold">{ready ? percentage : 0}% completato</h2><p className="mt-2 text-sm text-[var(--muted)]">{completed.length} moduli conclusi su {totalAcademyModules} · {storageMode === "database" ? "sincronizzati su database" : "salvati sul dispositivo"}</p></div>
        <div className="w-full sm:max-w-sm"><div className="h-2 overflow-hidden rounded-full bg-[var(--line)]"><div className="h-full rounded-full bg-[var(--signal)] transition-all" style={{ width: `${percentage}%` }} /></div><div className="mt-2 flex justify-between text-xs text-[var(--muted)]"><span>{xp.toLocaleString("it-IT")} XP</span><span>{totalAcademyXp.toLocaleString("it-IT")} XP</span></div></div>
      </div>

      {academyLevels.map((level, levelIndex) => {
        const done = level.modules.filter((module) => completed.includes(module.id)).length;
        const requiredModules = academyLevels
          .slice(0, levelIndex)
          .flatMap((previousLevel) => previousLevel.modules.map((module) => module.id));
        const levelUnlocked = requiredModules.every((moduleId) => completed.includes(moduleId));
        return (
          <section key={level.level} className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
            <div className="surface-grid grid gap-5 border-b border-[var(--line)] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="grid size-14 place-items-center rounded-full border border-[var(--line-strong)] font-mono text-lg text-[var(--signal)]">{String(level.level).padStart(2, "0")}</div>
              <div><p className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-[var(--cyan)]">{level.eyebrow}</p><h2 className="font-display mt-1 text-2xl font-semibold">{level.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{level.description}</p></div>
              <div className="font-mono text-xs text-[var(--muted)]">{done}/{level.modules.length} · {level.xp} XP</div>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {level.modules.map((module, index) => {
                const complete = completed.includes(module.id);
                const locked = !levelUnlocked;
                return (
                  <div key={module.id} className={`grid gap-4 p-5 sm:grid-cols-[2rem_1fr_auto] sm:items-center ${locked ? "opacity-65" : ""}`}>
                    <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <div><h3 className="font-display text-lg font-semibold">{module.title}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{module.description}</p><div className="mt-2 flex gap-3 text-xs text-[var(--muted)]"><span className="flex items-center gap-1"><Clock3 size={13} />{module.duration} min</span><span>{module.lessonCount} lezioni</span></div></div>
                    {locked ? (
                      <span className="flex min-h-10 items-center gap-2 border border-[var(--line)] px-3 text-xs text-[var(--muted)]"><LockKeyhole size={14} /> Livello {level.level - 1}</span>
                    ) : (
                      <Link href={`/academy/${module.id}/`} aria-label={`${complete ? "Ripassa" : "Inizia lezione"}: ${module.title}`} className={`flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold transition ${complete ? "border border-[var(--success)]/50 text-[var(--success)]" : "bg-[var(--paper)] text-[var(--ink)] hover:bg-white"}`}>
                        {complete && <Check size={16} />}{complete ? "Ripassa" : "Inizia lezione →"}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
