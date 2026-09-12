"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, MousePointer2, Move3D, Rotate3D, Search, Sparkles } from "lucide-react";
import { CameraStage } from "@/components/camera-simulator/camera-stage";
import { cameraControls, coachGuides, type CameraControlId, type CameraView } from "@/data/camera-controls";

const views: { id: CameraView; label: string }[] = [
  { id: "perspective", label: "3/4" },
  { id: "front", label: "Fronte" },
  { id: "rear", label: "Retro" },
  { id: "left", label: "Sinistra" },
  { id: "right", label: "Destra" },
  { id: "top", label: "Alto" },
];

const controlsById = new Map(cameraControls.map((control) => [control.id, control]));
const guidesById = new Map(coachGuides.map((guide) => [guide.id, guide]));

function matchGuide(query: string) {
  const normalized = query.toLocaleLowerCase("it");
  if (/sport|servo|atleta|movimento|tracking/.test(normalized)) return "sport-servo" as const;
  if (/manual|mf|stella|via lattea|astro/.test(normalized)) return "manual-focus" as const;
  if (/ritratt|portrait|eye|occhi|diaframma|\bav\b/.test(normalized)) return "portrait-av" as const;
  return null;
}

export function CameraSimulator() {
  const [activeId, setActiveId] = useState<CameraControlId>("mode-dial");
  const [view, setView] = useState<CameraView>("perspective");
  const [guideId, setGuideId] = useState<(typeof coachGuides)[number]["id"]>("portrait-av");
  const [stepIndex, setStepIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [showModel, setShowModel] = useState(true);
  const [modelVersion, setModelVersion] = useState(0);

  const activeControl = controlsById.get(activeId) ?? cameraControls[0];
  const guide = guidesById.get(guideId) ?? coachGuides[0];
  const step = guide.steps[stepIndex];
  const stepControl = controlsById.get(step.controlId) ?? cameraControls[0];

  const showStep = (nextIndex: number, nextGuide = guide) => {
    const boundedIndex = Math.max(0, Math.min(nextGuide.steps.length - 1, nextIndex));
    const nextStep = nextGuide.steps[boundedIndex];
    const control = controlsById.get(nextStep.controlId);
    setStepIndex(boundedIndex);
    setFinished(false);
    setActiveId(nextStep.controlId);
    if (control) setView(control.view);
  };

  const startGuide = (id: (typeof coachGuides)[number]["id"]) => {
    const nextGuide = guidesById.get(id) ?? coachGuides[0];
    setGuideId(id);
    setSearchMessage("");
    showStep(0, nextGuide);
  };

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const match = matchGuide(query);
    if (!match) {
      setSearchMessage("Non ho una guida per questa richiesta. Scegli uno dei percorsi disponibili qui sotto. La ricerca seleziona guide predefinite, non è una chat AI.");
      return;
    }
    startGuide(match);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setShowModel((current) => !current)} aria-pressed={!showModel} className="min-h-11 border border-[var(--line)] px-4 text-sm">{showModel ? "Usa solo le istruzioni" : "Mostra modello 3D"}</button>
        {showModel ? <button type="button" onClick={() => { setView("perspective"); setModelVersion((current) => current + 1); }} className="min-h-11 border border-[var(--line)] px-4 text-sm">Ripristina vista e zoom</button> : null}
        <p className="text-xs text-[var(--muted)]">Modello schematico: non è una replica completa dei menu Canon.</p>
      </div>
      <section className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3" aria-label="Come usare il simulatore">
        {[
          ["01", "Scegli una guida", "Av, Eye Detection, Servo AF o fuoco manuale"],
          ["02", "Segui il punto luminoso", "Il modello ruota verso il comando corretto"],
          ["03", "Ripeti sulla fotocamera", "Conferma ogni passaggio sulla tua EOS R10"],
        ].map(([number, title, description]) => (
          <div key={number} className="flex gap-4 bg-[var(--panel)] p-4 sm:p-5">
            <span className="font-mono text-sm font-semibold text-[var(--signal)]">{number}</span>
            <div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p></div>
          </div>
        ))}
      </section>
      <section className={`premium-panel grid overflow-hidden ${showModel ? "xl:grid-cols-[minmax(0,1.45fr)_420px]" : ""}`}>
        {showModel ? <div className="camera-studio relative min-h-[460px] border-b border-[var(--line)] sm:min-h-[560px] xl:border-b-0 xl:border-r">
          <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
            <div className="glass flex items-center gap-2 border border-black/15 px-3 py-2 text-xs text-[var(--paper)] shadow-lg">
              <Rotate3D size={15} className="text-[var(--cyan)]" aria-hidden="true" /> Trascina per ruotare · pizzica o scroll per zoom
            </div>
            <div className="glass flex flex-wrap border border-black/15 p-1 shadow-lg" aria-label="Vista fotocamera">
              {views.map((item) => (
                <button key={item.id} type="button" aria-pressed={view === item.id} onClick={() => setView(item.id)} className={`min-h-11 px-3 text-xs transition ${view === item.id ? "bg-[var(--signal)] text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--paper)]"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <CameraStage key={modelVersion} controls={cameraControls} activeId={activeId} view={view} onSelect={setActiveId} />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div className="glass border border-[var(--signal)]/70 px-4 py-3 shadow-xl">
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--signal)]">Comando evidenziato</div>
              <div className="mt-1 font-display text-lg font-semibold">{activeControl.name}</div>
            </div>
            <div className="hidden font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)] sm:block">Schema didattico · EOS R10</div>
          </div>
        </div> : null}

        <aside className="flex min-h-[500px] flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--cyan)]">Mostrami cosa premere</p>
              <h2 className="font-display mt-2 text-2xl font-semibold">{guide.title}</h2>
            </div>
            <span className="font-mono text-xs text-[var(--signal)]">{stepIndex + 1}/{guide.steps.length}</span>
          </div>

          <div className="mt-5 flex gap-1" aria-label="Progresso procedura">
            {guide.steps.map((item, index) => <span key={`${guide.id}-${item.title}`} className={`h-1 flex-1 ${index <= stepIndex ? "bg-[var(--signal)]" : "bg-[var(--line)]"}`} />)}
          </div>

          <div aria-live="polite" className="mt-6 border-l-2 border-[var(--signal)] bg-white/[0.025] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--signal)]"><MousePointer2 size={15} /> {stepControl.label}</div>
            <h3 className="font-display mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.instruction}</p>
            {step.menuPath ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {step.menuPath.map((item, index) => (
                  <span key={`${item}-${index}`} className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[var(--paper)]">
                    {index > 0 ? <ArrowRight size={12} className="text-[var(--muted)]" /> : null}
                    <span className="border border-[var(--line-strong)] bg-[var(--ink)] px-2 py-1.5">{item}</span>
                  </span>
                ))}
              </div>
            ) : null}
            <p className="mt-4 flex gap-2 text-xs leading-5 text-[var(--muted)]"><Check size={15} className="mt-0.5 shrink-0 text-[var(--success)]" />{step.check}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <button type="button" onClick={() => showStep(stepIndex - 1)} disabled={stepIndex === 0} className="inline-flex min-h-11 items-center gap-2 border border-[var(--line)] px-4 text-sm text-[var(--muted)] transition enabled:hover:border-[var(--line-strong)] enabled:hover:text-[var(--paper)] disabled:opacity-35">
              <ArrowLeft size={16} /> Indietro
            </button>
            <button type="button" onClick={() => stepIndex === guide.steps.length - 1 ? setFinished(true) : showStep(stepIndex + 1)} disabled={finished} className="inline-flex min-h-11 items-center gap-2 bg-[var(--signal)] px-4 text-sm font-semibold text-[var(--ink)] transition enabled:hover:bg-[var(--signal-strong)] disabled:opacity-40">
              {finished ? "Terminata" : stepIndex === guide.steps.length - 1 ? "Ho finito" : "Prossimo"} <ArrowRight size={16} />
            </button>
          </div>
          {finished ? <div role="status" className="mt-4 border border-[var(--success)]/40 p-4 text-sm"><p>Guida terminata. Controlla il risultato sulla tua fotocamera: il simulatore non può verificarlo automaticamente.</p><button type="button" onClick={() => showStep(0)} className="mt-3 min-h-11 px-3 text-[var(--signal)] underline">Ripeti la guida</button></div> : null}
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[var(--signal)]"><Sparkles size={18} /><h2 className="font-display text-xl font-semibold">Scegli una guida rapida</h2></div>
          <p className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]"><Move3D size={14} aria-hidden="true" /> Scrivi l’obiettivo: il simulatore seleziona il percorso più vicino.</p>
          <form onSubmit={submitPrompt} className="mt-4 flex border border-[var(--line-strong)] bg-[var(--ink)] focus-within:border-[var(--signal)]">
            <label htmlFor="camera-command" className="sr-only">Comando da mostrare sulla EOS R10</label>
            <input id="camera-command" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Es. Imposta Av, f/2.8 ed Eye Detection" className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[var(--paper)] outline-none placeholder:text-[var(--muted)]" />
            <button type="submit" aria-label="Avvia guida" className="grid w-12 place-items-center text-[var(--signal)]"><Search size={18} /></button>
          </form>
          {searchMessage ? <p role="status" className="mt-3 text-sm leading-6 text-[var(--signal)]">{searchMessage}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {coachGuides.map((item) => <button key={item.id} type="button" onClick={() => startGuide(item.id)} className={`border px-3 py-2 text-left text-xs transition ${guide.id === item.id ? "border-[var(--signal)] text-[var(--paper)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]"}`}>{item.prompt}</button>)}
          </div>
        </div>

        <div className="border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--cyan)]">Scheda comando</p>
          <h2 className="font-display mt-2 text-2xl font-semibold">{activeControl.name}</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div><dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">Funzione</dt><dd className="mt-2 text-sm leading-6">{activeControl.function}</dd></div>
            <div><dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">Quando usarlo</dt><dd className="mt-2 text-sm leading-6">{activeControl.when}</dd></div>
            <div><dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">Esempio</dt><dd className="mt-2 text-sm leading-6">{activeControl.example}</dd></div>
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold">Tutti i comandi interattivi</h2><span className="font-mono text-xs text-[var(--muted)]">{cameraControls.length} hotspot</span></div>
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {cameraControls.map((control) => (
            <button key={control.id} type="button" onClick={() => { setActiveId(control.id); setView(control.view); }} className={`flex min-h-16 items-center justify-between gap-4 bg-[var(--panel)] px-4 py-3 text-left transition hover:bg-[var(--panel-raised)] ${activeId === control.id ? "text-[var(--signal)]" : "text-[var(--paper)]"}`}>
              <span className="text-sm font-semibold">{control.name}</span><span className="font-mono text-[0.62rem] text-[var(--muted)]">{control.view.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
