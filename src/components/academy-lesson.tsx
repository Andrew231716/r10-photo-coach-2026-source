"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppState } from "@/components/app-state-provider";
import { academyLevels } from "@/data/academy";
import { academyLessons } from "@/data/academy-lessons";

export function AcademyLessonReader({ moduleId }: { moduleId: string }) {
  const { ready, academyCompleted, toggleAcademyModule } = useAppState();
  const [step, setStep] = useState(0);
  const [practiced, setPracticed] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const levelIndex = academyLevels.findIndex(level => level.modules.some(module => module.id === moduleId));
  const module = academyLevels[levelIndex]?.modules.find(module => module.id === moduleId);
  const lesson = academyLessons[moduleId];
  if (!module || !lesson) return null;
  const unlocked = academyLevels.slice(0, levelIndex).flatMap(level => level.modules).every(module => academyCompleted.includes(module.id));
  const complete = academyCompleted.includes(moduleId);
  const titles = ["Capisci il concetto", "Prepara la EOS R10", "Prova sul campo"];
  const contents = [lesson.concept, lesson.setup, lesson.exercise];
  const button = "inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--signal)] px-5 py-3 font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed";
  return <div className="mx-auto max-w-3xl space-y-6">
    <Link href="/academy/" className="inline-flex min-h-11 items-center text-[var(--cyan)]">← Torna all’Academy</Link>
    <header><p className="text-sm text-[var(--signal)]">Livello {levelIndex + 1} · {module.duration} minuti con la pratica</p><h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{module.title}</h1><p className="mt-3 text-[var(--muted)]">{module.description}</p></header>
    {!ready ? <p role="status">Caricamento progressi…</p> : !unlocked ? <div className="rounded-2xl border border-[var(--line)] p-6"><h2 className="text-xl font-semibold">Completa prima i livelli precedenti</h2><p className="mt-3">Nell’Academy trovi i moduli ancora da concludere.</p></div> : <>
      <ol aria-label="Passaggi della lezione" className="grid grid-cols-3 gap-2">{titles.map((title, index) => <li key={title} aria-current={step === index ? "step" : undefined} className={`rounded-xl border p-3 text-sm ${step === index ? "border-[var(--signal)] text-[var(--signal)]" : "border-[var(--line)] text-[var(--muted)]"}`}>{index + 1}. {title}</li>)}</ol>
      <section key={step} aria-live="polite" className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8"><p className="text-sm text-[var(--cyan)]">Lezione {step + 1} di 3</p><h2 className="mt-2 text-2xl font-semibold">{titles[step]}</h2><p className="mt-5 text-lg leading-8">{contents[step]}</p>
        {step === 2 && <div className="mt-8 space-y-6"><label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={practiced} onChange={event => setPracticed(event.target.checked)} className="mt-1 size-5 shrink-0"/><span>Ho eseguito l’esercizio e confrontato i risultati.</span></label><fieldset><legend className="mb-3 text-lg font-semibold">{lesson.question}</legend><div className="space-y-2">{lesson.choices.map((choice, index) => <label key={choice} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[var(--line)] p-3"><input type="radio" name="lesson-answer" checked={answer === index} onChange={() => setAnswer(index)}/>{choice}</label>)}</div></fieldset>{answer !== null && <p role="status" className={answer === lesson.answer ? "text-[var(--success)]" : "text-[var(--signal)]"}>{answer === lesson.answer ? `Corretto. ${lesson.explanation}` : "Non ancora: rileggi il concetto e riprova."}</p>}</div>}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3"><button disabled={step === 0} onClick={() => setStep(value => value - 1)} className="min-h-12 px-4 disabled:opacity-30">← Indietro</button>{step < 2 ? <button className={button} onClick={() => setStep(value => value + 1)}>Continua →</button> : complete ? <Link href="/academy/" className={button}>Modulo completato · Vai all’Academy</Link> : <button className={button} disabled={!practiced || answer !== lesson.answer} onClick={() => { if (!complete) toggleAcademyModule(moduleId); }}>Completa il modulo</button>}</div>
      {complete && <p role="status" className="text-[var(--success)]">Modulo completato. Puoi rileggerlo senza perdere i progressi.</p>}
    </>}
  </div>;
}
