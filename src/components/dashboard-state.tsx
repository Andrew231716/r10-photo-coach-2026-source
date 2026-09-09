"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, Camera, Check, Layers3, PackageCheck, Zap } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";
import { ProgressRing } from "@/components/progress-ring";
import { academyLevels } from "@/data/academy";
import { allGear } from "@/data/gear";
import { tutorials } from "@/data/tutorials";
import { getAcademyXp, totalAcademyModules } from "@/lib/academy-metrics";

export function DashboardStats() {
  const { academyCompleted, tutorialsCompleted, ownedGear } = useAppState();
  const xp = getAcademyXp(academyCompleted) + tutorialsCompleted.length * 80;
  const stats = [
    { value: xp.toLocaleString("it-IT"), label: "XP accumulati", icon: Zap },
    { value: `${tutorialsCompleted.length} / ${tutorials.length}`, label: "tutorial completati", icon: BookOpenCheck },
    { value: `${academyCompleted.length} / ${totalAcademyModules}`, label: "moduli Academy", icon: Layers3 },
    { value: String(ownedGear.length), label: "elementi nel kit", icon: PackageCheck },
  ];

  return (
    <section className="animate-rise delay-2 grid grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)] xl:grid-cols-4" aria-label="I tuoi progressi">
      {stats.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex min-w-0 items-center gap-3 bg-[var(--panel)] p-4 sm:gap-4 sm:p-5">
          <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-white/[0.04] text-[var(--signal)] sm:grid"><Icon size={18} aria-hidden="true" /></span>
          <div className="min-w-0"><div className="font-display text-xl font-semibold sm:text-2xl">{value}</div><div className="mt-1 text-xs leading-4 text-[var(--muted)] sm:text-sm">{label}</div></div>
        </div>
      ))}
    </section>
  );
}

export function DashboardAcademyCard() {
  const { academyCompleted, storageMode } = useAppState();
  const modules = academyLevels.flatMap((level) => level.modules);
  const nextModule = modules.find((module) => !academyCompleted.includes(module.id));
  const percentage = Math.round((academyCompleted.length / totalAcademyModules) * 100);

  return (
    <section className="premium-panel p-6 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ProgressRing value={percentage} label="Percorso Academy" />
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--cyan)]">{nextModule ? "Continua l'Academy" : "Academy completata"}</p>
          <h2 className="font-display mt-2 text-2xl font-semibold">{nextModule?.title ?? "Ottimo lavoro"}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{academyCompleted.length} moduli su {totalAcademyModules} · {storageMode === "database" ? "sincronizzati su database" : "salvati sul dispositivo"}</p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--line)]"><div className="h-full rounded-full bg-[var(--cyan)] transition-all" style={{ width: `${percentage}%` }} /></div>
        </div>
        <Link href="/academy" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--signal)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--signal-strong)]" aria-label="Continua il percorso Academy"><span>Continua</span><ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

export function DashboardGearCard() {
  const { ownedGear } = useAppState();
  const owned = allGear.filter((item) => ownedGear.includes(item.id));

  return (
    <section className="premium-panel p-6">
      <div className="flex items-center justify-between"><Camera className="text-[var(--signal)]" size={23} /><span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">Il tuo kit</span></div>
      <h2 className="font-display mt-5 text-xl font-semibold">{owned.length ? "Pronto per uscire" : "Configura il tuo kit"}</h2>
      {owned.length ? (
        <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">{owned.slice(0, 3).map((item) => <li key={item.id} className="flex gap-2"><Check size={16} className="shrink-0 text-[var(--cyan)]" />{item.name}</li>)}</ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Aggiungi fotocamera e obiettivi per ricevere consigli coerenti.</p>
      )}
      {owned.length > 3 ? <p className="mt-3 text-xs text-[var(--muted)]">e altri {owned.length - 3} elementi</p> : null}
      <Link href="/gear" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--paper)]">Gestisci attrezzatura <ArrowRight size={15} /></Link>
    </section>
  );
}
