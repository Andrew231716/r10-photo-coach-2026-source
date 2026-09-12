"use client";

import Link from "next/link";
import { ArrowRight, Check, Trophy } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";

const missions = [
  { slug: "ritratto", title: "Il soggetto al centro", task: "Segui il tutorial Ritratto e prova il suo esercizio con una persona disponibile." },
  { slug: "paesaggio", title: "Osserva la scena", task: "Segui la guida Paesaggio e prova l’esercizio cambiando il punto di ripresa." },
  { slug: "sport", title: "Racconta il movimento", task: "Segui la guida Sport e confronta i risultati dell’esercizio pratico." },
  { slug: "notte", title: "Esplora la poca luce", task: "Apri Notte urbana e metti in pratica l’esercizio in un luogo sicuro." },
];

export function ProgressMissions() {
  const { ready, tutorialsCompleted } = useAppState();
  if (!ready) return <section className="premium-panel p-6" aria-busy="true">Caricamento missioni…</section>;
  const completed = missions.filter((mission) => tutorialsCompleted.includes(mission.slug));
  const next = missions.find((mission) => !tutorialsCompleted.includes(mission.slug));
  return (
    <section className="premium-panel border-[var(--signal)]/50 p-6 sm:p-7" aria-labelledby="missions-title">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--signal)]">Il tuo prossimo passo</p>
      <h2 id="missions-title" className="font-display mt-3 text-2xl font-semibold">{next?.title ?? "Percorso missioni completato"}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{next?.task ?? "Hai completato le quattro guide del percorso. Esplora gli altri scenari per continuare."}</p>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Dopo la pratica, segna il tutorial come completato nella sua pagina. La missione segue quel progresso, senza XP aggiuntivi o valutazioni automatiche dello scatto.</p>
      <Link href={next ? `/tutorials/${next.slug}` : "/tutorials"} className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[var(--signal)] px-4 text-sm font-semibold text-[var(--ink)]">{next ? "Apri guida ed esercizio" : "Esplora altri tutorial"}<ArrowRight size={16} aria-hidden="true" /></Link>
      <p className="mt-5 text-sm" role="status">{completed.length} di {missions.length} missioni completate</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {missions.map((mission) => {
          const unlocked = tutorialsCompleted.includes(mission.slug);
          return <li key={mission.slug}><Link href={`/tutorials/${mission.slug}`} className="flex min-h-12 items-center gap-2 border border-[var(--line)] p-3 text-sm"><span className={unlocked ? "text-[var(--success)]" : "text-[var(--muted)]"}>{unlocked ? <Check size={17} aria-hidden="true" /> : <Trophy size={17} aria-hidden="true" />}</span><span>{mission.title}<span className="mt-1 block text-xs text-[var(--muted)]">{unlocked ? "Badge ottenuto" : "Badge da sbloccare"}</span></span></Link></li>;
        })}
      </ul>
    </section>
  );
}
