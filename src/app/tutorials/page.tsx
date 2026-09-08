import type { Metadata } from "next";
import { TutorialExplorer } from "@/components/tutorial-explorer";
import { tutorialCategories, tutorials } from "@/data/tutorials";

export const metadata: Metadata = { title: "Tutorial fotografici" };

export default function TutorialsPage() {
  const items = tutorials.map(({ slug, symbol, category, difficulty, title, summary, minutes, ownedLens }) => ({ slug, symbol, category, difficulty, title, summary, minutes, ownedLens }));
  return (
    <div className="space-y-8">
      <header className="max-w-4xl"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Dal soggetto alle impostazioni</p><h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">23 situazioni, una EOS R10.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Scegli ciò che hai davanti: ogni tutorial parte dall'obiettivo che possiedi già e ti porta fino allo scatto con un esercizio verificabile.</p></header>
      <TutorialExplorer items={items} categories={tutorialCategories} />
    </div>
  );
}
