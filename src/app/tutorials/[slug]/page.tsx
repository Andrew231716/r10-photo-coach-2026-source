import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Aperture, ArrowLeft, BadgeEuro, Camera, CheckCircle2, Clock3, Compass, ExternalLink, Focus, Footprints, Lightbulb, Target, XCircle } from "lucide-react";
import { TutorialComplete } from "@/components/tutorial-complete";
import { getTutorial, tutorials } from "@/data/tutorials";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return tutorials.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  return tutorial ? { title: tutorial.title, description: tutorial.summary } : { title: "Tutorial non trovato" };
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) notFound();
  const settingEntries = [
    ["Modalità", tutorial.settings.mode], ["Diaframma", tutorial.settings.aperture], ["Tempo", tutorial.settings.shutter], ["ISO", tutorial.settings.iso],
    ["Autofocus", tutorial.settings.autofocus], ["Area AF", tutorial.settings.afArea], ["Soggetto", tutorial.settings.subjectDetection], ["Eye Detection", tutorial.settings.eyeDetection],
    ["Bilanciamento", tutorial.settings.whiteBalance], ["Formato", tutorial.settings.fileFormat], ["Stabilizzazione", tutorial.settings.stabilization], ["Scatto", tutorial.settings.drive],
  ];
  return (
    <article className="mx-auto max-w-6xl">
      <Link href="/tutorials" className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--paper)]"><ArrowLeft size={16} /> Tutti i tutorial</Link>
      <header className="surface-grid mt-3 border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-9">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full border border-[var(--signal)] font-mono text-xs text-[var(--signal)]">{tutorial.symbol}</span><span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--cyan)]">{tutorial.category} · {tutorial.difficulty}</span></div><h1 className="font-display mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">{tutorial.title}</h1><p className="mt-4 text-lg leading-8 text-[var(--muted)]">{tutorial.summary}</p></div>
          <div className="shrink-0 space-y-3 text-sm text-[var(--muted)]"><div className="flex items-center gap-2"><Clock3 size={16} /> {tutorial.minutes} minuti</div><div className="flex items-center gap-2"><Camera size={16} /> EOS R10</div><div className="flex items-center gap-2 text-[var(--signal)]"><Aperture size={16} /> {tutorial.ownedLens}</div></div>
        </div>
        <div className="mt-8 border-l-2 border-[var(--signal)] bg-black/20 p-5"><p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--signal)]">Risultato da ottenere</p><p className="mt-2 text-base leading-7">{tutorial.outcome}</p></div>
      </header>

      <section className="mt-8"><div className="mb-4 flex items-center gap-3"><Focus className="text-[var(--signal)]" /><h2 className="font-display text-2xl font-semibold">Setup EOS R10</h2></div><div className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">{settingEntries.map(([label, value]) => <div key={label} className="bg-[var(--panel)] p-4"><div className="font-mono text-[0.66rem] uppercase tracking-[0.13em] text-[var(--muted)]">{label}</div><div className="font-mono mt-2 text-sm font-medium leading-6 text-[var(--signal-strong)]">{value}</div></div>)}</div><div className="mt-3 flex gap-3 border border-[var(--line)] bg-[var(--panel)] p-5 text-sm leading-6 text-[var(--muted)]"><Lightbulb className="mt-0.5 shrink-0 text-[var(--cyan)]" size={19} /><p><strong className="text-[var(--paper)]">Perché funziona: </strong>{tutorial.why}</p></div></section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <section><div className="mb-4 flex items-center gap-3"><Target className="text-[var(--signal)]" /><h2 className="font-display text-2xl font-semibold">Procedura sul campo</h2></div><ol className="border border-[var(--line)] bg-[var(--panel)]">{tutorial.steps.map((step, index) => <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-[var(--line)] p-5 last:border-0"><span className="font-mono text-xs text-[var(--signal)]">{String(index + 1).padStart(2, "0")}</span><span className="text-sm leading-6">{step}</span></li>)}</ol></section>
        <div className="space-y-6"><section className="border border-[var(--line)] bg-[var(--panel)] p-5"><h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Compass size={19} className="text-[var(--cyan)]" /> Composizione</h2><ul className="mt-4 space-y-3">{tutorial.composition.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--muted)]"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--cyan)]" />{item}</li>)}</ul></section><section className="border border-[var(--line)] bg-[var(--panel)] p-5"><h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Footprints size={19} className="text-[var(--signal)]" /> Posizione</h2><ul className="mt-4 space-y-3">{tutorial.position.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--muted)]"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--signal)]" />{item}</li>)}</ul></section></div>
      </div>

      <section className="mt-8 border border-[var(--danger)]/30 bg-[var(--danger)]/[0.04] p-6"><h2 className="flex items-center gap-2 font-display text-xl font-semibold text-[var(--danger)]"><AlertTriangle size={19} /> Errori comuni</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{tutorial.errors.map((error) => <div key={error} className="flex gap-2 text-sm leading-6 text-[var(--muted)]"><XCircle size={16} className="mt-1 shrink-0 text-[var(--danger)]" />{error}</div>)}</div></section>
      <section className="mt-8 border border-[var(--signal)]/40 bg-[linear-gradient(135deg,rgba(240,179,35,.12),var(--panel))] p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--signal)]">Prova pratica</p><h2 className="font-display mt-2 text-2xl font-semibold">Adesso verifica la tecnica</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{tutorial.exercise}</p></div><TutorialComplete slug={tutorial.slug} /></div></section>

      <section className="mt-8"><div className="mb-4 flex items-center gap-3"><BadgeEuro className="text-[var(--signal)]" /><h2 className="font-display text-2xl font-semibold">Quanto serve spendere</h2></div><div className="grid gap-4 md:grid-cols-3">{tutorial.costs.map((cost, index) => <div key={cost.level} className={`border p-5 ${index === 0 ? "border-[var(--success)]/50 bg-[var(--success)]/[0.04]" : "border-[var(--line)] bg-[var(--panel)]"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--muted)]">{cost.level}</span><span className="font-mono text-sm text-[var(--signal)]">{cost.price}</span></div><h3 className="font-display mt-4 text-lg font-semibold">{cost.item}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{cost.reason}</p></div>)}</div><p className="mt-3 text-xs text-[var(--muted)]">Prezzi indicativi rilevati in Italia: possono cambiare e non sono un invito all'acquisto.</p></section>
      <footer className="mt-8 border-t border-[var(--line)] pt-5"><p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--muted)]">Verifica tecnica Canon</p><div className="mt-3 flex flex-wrap gap-3">{tutorial.canonSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-[var(--line)] px-3 text-xs text-[var(--muted)] transition hover:text-[var(--paper)]">{source.label}<ExternalLink size={13} /></a>)}</div></footer>
    </article>
  );
}
