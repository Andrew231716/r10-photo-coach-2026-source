import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Box, Camera, SlidersHorizontal, UserRound } from "lucide-react";
import { ProgressMissions } from "@/components/progress-missions";
import { SaveStatus } from "@/components/save-status";
import { DashboardAcademyCard, DashboardGearCard, DashboardStats } from "@/components/dashboard-state";
import { ScenarioSearch } from "@/components/scenario-search";
import { SectionHeading } from "@/components/section-heading";
import { TutorialCard } from "@/components/tutorial-card";
import { tutorials } from "@/data/tutorials";

export default function HomePage() {
  const featured = tutorials.filter((tutorial) => tutorial.featured).slice(0, 4);
  const searchItems = tutorials.map(({ slug, title, category, summary }) => ({ slug, title, category, summary }));
  return (
    <div className="space-y-9 sm:space-y-12">
      <section className="animate-rise relative min-h-[440px] overflow-hidden border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_30px_90px_rgba(0,0,0,.32)] sm:min-h-[500px]">
        <Image src="/hero-golden-hour.webp" alt="Fotografo che realizza un ritratto al tramonto sulla costa" fill priority sizes="(max-width: 1024px) 100vw, 75vw" className="object-cover object-[62%_center] saturate-[.88] contrast-[1.08]" />
        <div className="hero-vignette absolute inset-0" />
        <div className="surface-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 flex min-h-[440px] max-w-3xl flex-col justify-end p-5 sm:min-h-[500px] sm:p-10 lg:p-12">
          <div className="mb-auto flex w-fit items-center gap-2 border border-[var(--signal)]/40 bg-black/45 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--signal-strong)] backdrop-blur"><span className="size-2 rounded-full bg-[var(--signal)] shadow-[0_0_12px_var(--signal)]" /> 23 guide pronte</div>
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--cyan)]">Il tuo coach sul campo</p>
          <h1 className="font-display max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">Cosa vuoi fotografare?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">Ti mostro subito impostazioni, obiettivo e comandi da usare sulla tua EOS R10.</p>
          <ScenarioSearch items={searchItems} />
        </div>
      </section>

      <section className="animate-rise delay-1" aria-labelledby="choose-path-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--cyan)]">Scegli il tuo obiettivo</p>
            <h2 id="choose-path-title" className="font-display mt-2 text-2xl font-semibold sm:text-3xl">Da dove vuoi iniziare?</h2>
          </div>
          <span className="text-sm text-[var(--muted)]">Un tocco e sei nel percorso giusto</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Voglio imparare", text: "Segui l’Academy in ordine, partendo dalle basi.", href: "/academy", action: "Apri Academy", tone: "var(--amber-glow)" },
            { icon: SlidersHorizontal, title: "Mi serve un setup", text: "Trova valori pronti per la scena che hai davanti.", href: "/tutorials", action: "Esplora le guide", tone: "var(--cyan-glow)" },
            { icon: Camera, title: "Mostrami i comandi", text: "Guarda dove premere direttamente sul modello 3D.", href: "/simulator", action: "Apri simulatore", tone: "rgba(124,205,145,.14)" },
          ].map(({ icon: Icon, title, text, href, action, tone }) => (
            <Link key={title} href={href} className="action-card group min-h-48 p-5 transition hover:-translate-y-0.5 hover:border-[var(--line-strong)] sm:p-6" style={{ "--card-glow": tone } as React.CSSProperties}>
              <span className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] bg-white/[0.025] text-[var(--signal)]"><Icon size={20} aria-hidden="true" /></span>
              <h3 className="font-display mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
              <span className="relative z-10 mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--paper)]">{action}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <DashboardStats />
      <SaveStatus />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <DashboardAcademyCard />

        <ProgressMissions />
      </div>

      <section>
        <SectionHeading eyebrow="23 situazioni reali" title="Tutorial scelti per te" href="/tutorials" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{featured.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} />)}</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardGearCard />
        <section className="premium-panel p-6">
          <div className="flex items-center justify-between"><UserRound className="text-[var(--cyan)]" size={23} /><span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--success)]">Sincronizza</span></div>
          <h2 className="font-display mt-5 text-xl font-semibold">Il tuo profilo</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Conserva Academy, tutorial e attrezzatura anche quando cambi dispositivo.</p>
          <Link href="/profile" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--paper)]">Gestisci profilo <ArrowRight size={15} /></Link>
        </section>
        <section className="premium-panel surface-grid p-6">
          <div className="flex items-center justify-between"><Box className="text-[var(--signal)]" size={23} /><span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--success)]">Attivo</span></div>
          <h2 className="font-display mt-5 text-xl font-semibold">Simulatore EOS R10</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Ruota il modello e segui “Mostrami cosa devo premere” per Av, Eye Detection, Servo AF e MF.</p>
          <Link href="/simulator" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--paper)]">Apri il simulatore <ArrowRight size={15} /></Link>
        </section>
      </div>
    </div>
  );
}
