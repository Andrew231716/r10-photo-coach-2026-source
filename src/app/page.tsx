import Image from "next/image";
import Link from "next/link";
import { Aperture, ArrowRight, Bot, Box, Camera, SlidersHorizontal, Target } from "lucide-react";
import { DashboardAcademyCard, DashboardGearCard, DashboardStats } from "@/components/dashboard-state";
import { ScenarioSearch } from "@/components/scenario-search";
import { SectionHeading } from "@/components/section-heading";
import { TutorialCard } from "@/components/tutorial-card";
import { tutorials } from "@/data/tutorials";

export default function HomePage() {
  const featured = tutorials.filter((tutorial) => tutorial.featured).slice(0, 4);
  const searchItems = tutorials.map(({ slug, title, category, summary }) => ({ slug, title, category, summary }));
  return (
    <div className="space-y-10">
      <section className="animate-rise relative min-h-[430px] overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
        <Image src="/hero-golden-hour.webp" alt="Fotografo che realizza un ritratto al tramonto sulla costa" fill priority sizes="(max-width: 1024px) 100vw, 75vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="surface-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 flex min-h-[430px] max-w-3xl flex-col justify-end p-6 sm:p-9 lg:p-12">
          <div className="mb-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal-strong)]"><span className="size-2 rounded-full bg-[var(--signal)]" /> Modalità allenamento</div>
          <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Cosa vuoi fotografare oggi?</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">Parti dalla scena reale. R10 Photo Coach traduce luce, soggetto e movimento in impostazioni, posizione ed esercizi per la tua EOS R10.</p>
          <ScenarioSearch items={searchItems} />
        </div>
      </section>

      <section className="animate-rise delay-1" aria-labelledby="quick-start-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--cyan)]">Inizia da qui</p>
            <h2 id="quick-start-title" className="font-display mt-2 text-2xl font-semibold sm:text-3xl">Dalla scena allo scatto in 3 passi</h2>
          </div>
          <span className="text-sm text-[var(--muted)]">Nessun menu da studiare a memoria</span>
        </div>
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {[
            { step: "01", icon: Camera, title: "Scegli la scena", text: "Descrivi cosa hai davanti o apri uno dei 23 tutorial.", href: "/tutorials", action: "Trova il tutorial" },
            { step: "02", icon: SlidersHorizontal, title: "Copia il setup", text: "Imposta tempo, diaframma, ISO e autofocus consigliati.", href: "/tutorials/ritratto", action: "Vedi un esempio" },
            { step: "03", icon: Aperture, title: "Prova sulla R10", text: "Il simulatore evidenzia il comando e ti guida passo passo.", href: "/simulator", action: "Apri il simulatore" },
          ].map(({ step, icon: Icon, title, text, href, action }) => (
            <Link key={step} href={href} className="group relative min-h-52 overflow-hidden bg-[var(--panel)] p-6 transition hover:bg-[var(--panel-raised)]">
              <div className="absolute right-4 top-2 font-display text-7xl font-semibold tracking-[-0.08em] text-white/[0.035]">{step}</div>
              <span className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--signal)]"><Icon size={20} aria-hidden="true" /></span>
              <h3 className="font-display mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--paper)]">{action}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <DashboardAcademyCard />

        <section className="relative overflow-hidden border border-[var(--signal)]/50 bg-[linear-gradient(135deg,rgba(240,179,35,.14),rgba(19,23,26,.98)_55%)] p-6 sm:p-7">
          <div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-full bg-[var(--signal)] text-[var(--ink)]"><Target size={20} aria-hidden="true" /></span><span className="font-mono text-xs text-[var(--signal)]">+120 XP</span></div>
          <h2 className="font-display mt-5 text-2xl font-semibold">Missione del giorno</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Congela un salto a 1/1000 s, poi ripetilo a 1/250 s. Confronta mani, piedi e sfondo.</p>
          <Link href="/tutorials/sport" className="mt-5 inline-flex min-h-11 items-center gap-2 bg-[var(--paper)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-white">Inizia missione <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </div>

      <section>
        <SectionHeading eyebrow="23 situazioni reali" title="Tutorial scelti per te" href="/tutorials" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{featured.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} />)}</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardGearCard />
        <section className="border border-[var(--line)] bg-[var(--panel)] p-6">
          <div className="flex items-center justify-between"><Bot className="text-[var(--cyan)]" size={23} /><span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">Fase 3</span></div>
          <h2 className="font-display mt-5 text-xl font-semibold">AI Photo Coach</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Riceverà contesto, livello e attrezzatura per proporre un setup concreto e spiegato.</p>
          <span className="mt-5 inline-flex border border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)]">Predisposizione pronta</span>
        </section>
        <section className="surface-grid border border-[var(--line)] bg-[var(--panel)] p-6">
          <div className="flex items-center justify-between"><Box className="text-[var(--signal)]" size={23} /><span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--success)]">Attivo</span></div>
          <h2 className="font-display mt-5 text-xl font-semibold">Simulatore EOS R10</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Ruota il modello e segui “Mostrami cosa devo premere” per Av, Eye Detection, Servo AF e MF.</p>
          <Link href="/simulator" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--paper)]">Apri il simulatore <ArrowRight size={15} /></Link>
        </section>
      </div>
    </div>
  );
}
