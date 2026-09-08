import type { Metadata } from "next";
import { GearManager } from "@/components/gear-manager";

export const metadata: Metadata = { title: "La mia attrezzatura" };

export default function GearPage() {
  return (
    <div>
      <header className="mb-8 max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Profilo attrezzatura</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Il consiglio migliore parte dal tuo zaino.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">La dotazione iniziale è già configurata. Le modifiche vengono salvate subito sul dispositivo e sincronizzate automaticamente quando il database è collegato.</p>
      </header>
      <GearManager />
    </div>
  );
}
