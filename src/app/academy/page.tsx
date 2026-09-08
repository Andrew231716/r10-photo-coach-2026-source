import type { Metadata } from "next";
import { AcademyProgress } from "@/components/academy-progress";
import { totalAcademyLessons } from "@/data/academy";

export const metadata: Metadata = { title: "Academy" };

export default function AcademyPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">5 livelli · {totalAcademyLessons} lezioni</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Impara in ordine. Scatta fin da subito.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Ogni concetto porta a una prova concreta sulla EOS R10. Il livello successivo si sblocca quando la tecnica precedente è diventata un'abitudine.</p>
      </header>
      <AcademyProgress />
    </div>
  );
}
