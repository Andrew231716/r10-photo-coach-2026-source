import type { Metadata } from "next";
import { Suspense } from "react";
import { CoachWorkspace } from "@/components/coach-workspace";

export const metadata: Metadata = { title: "Photo Coach" };

export default function CoachPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Laboratorio foto</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Capisci cosa migliorare, poi riscattala.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Analizza uno scatto in privato sul dispositivo oppure chiedi al coach impostazioni e procedure per la tua EOS R10.
        </p>
      </header>
      <Suspense fallback={<div className="premium-panel p-6 text-sm text-[var(--muted)]">Caricamento coach…</div>}>
        <CoachWorkspace />
      </Suspense>
    </div>
  );
}
