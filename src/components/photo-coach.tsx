"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";
import { Aperture, Camera, CheckCircle2, ImagePlus, ShieldCheck, TriangleAlert } from "lucide-react";

type Goal = "portrait" | "landscape" | "action" | "night";
type Analysis = {
  score: number;
  exposure: string;
  contrast: string;
  sharpness: string;
  color: string;
  suggestions: string[];
};

const goals: Record<Goal, { label: string; setup: string }> = {
  portrait: { label: "Ritratto", setup: "Av · f/1.8–f/4 · Eye Detection · ISO Auto" },
  landscape: { label: "Paesaggio", setup: "Av · f/8 · ISO 100 · AF singolo" },
  action: { label: "Sport e movimento", setup: "M · 1/1000 s · Servo AF · ISO Auto" },
  night: { label: "Notte", setup: "M · 1/60 s o treppiede · diaframma aperto · RAW" },
};

function decodeImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement("img");
    const url = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode_failed")); };
    image.src = url;
  });
}

async function inspectPhoto(file: File, goal: Goal): Promise<Analysis> {
  const image = await decodeImage(file);
  const scale = Math.min(1, 420 / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("canvas_unavailable");
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  let count = 0, sum = 0, sumSquares = 0, shadows = 0, highlights = 0, warmth = 0, edges = 0, edgeCount = 0, previous = 0;
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += light; sumSquares += light * light; warmth += r - b;
    if (light < 24) shadows += 1;
    if (light > 235) highlights += 1;
    if (count > 0) { edges += Math.abs(light - previous); edgeCount += 1; }
    previous = light; count += 1;
  }
  const average = sum / count;
  const deviation = Math.sqrt(Math.max(0, sumSquares / count - average * average));
  const shadowRate = shadows / count;
  const highlightRate = highlights / count;
  const edgeStrength = edges / Math.max(1, edgeCount);
  const colorShift = warmth / count;
  const suggestions: string[] = [];
  let score = 100;
  let exposure = "Esposizione equilibrata";
  if (average < 72) { exposure = "Foto complessivamente scura"; suggestions.push("Prova +2/3 EV in Av oppure aumenta l’ISO mantenendo un tempo sicuro."); score -= 18; }
  else if (average > 188) { exposure = "Foto complessivamente chiara"; suggestions.push("Prova −2/3 EV e controlla le zone lampeggianti nell’anteprima della R10."); score -= 18; }
  if (highlightRate > 0.08) { suggestions.push("Ci sono molte alte luci senza dettaglio: usa l’istogramma e riduci l’esposizione."); score -= 12; }
  if (shadowRate > 0.28 && goal !== "night") { suggestions.push("Le ombre sono molto chiuse: cerca luce più morbida o recupera le ombre dal RAW."); score -= 10; }
  let contrast = "Contrasto naturale";
  if (deviation < 34) { contrast = "Contrasto basso"; suggestions.push("Aumenta la separazione tra soggetto e sfondo cambiando angolo o direzione della luce."); score -= 10; }
  else if (deviation > 78) { contrast = "Contrasto molto forte"; suggestions.push("Proteggi le alte luci e valuta una luce più uniforme."); score -= 8; }
  let sharpness = "Dettaglio nella norma";
  if (edgeStrength < 9) { sharpness = "Dettaglio debole o scena morbida"; suggestions.push(goal === "action" ? "Usa almeno 1/1000 s, Servo AF e raffiche brevi." : "Controlla il punto AF e usa un tempo almeno pari a 1/(focale equivalente)." ); score -= 18; }
  else if (edgeStrength > 24) sharpness = "Dettaglio marcato";
  const color = colorShift > 16 ? "Dominante calda" : colorShift < -16 ? "Dominante fredda" : "Colore neutro";
  if (Math.abs(colorShift) > 28) suggestions.push("Se la dominante non è intenzionale, prova AWB Priorità ambiente o correggi il bilanciamento dal RAW.");
  if (!suggestions.length) suggestions.push("La base tecnica è equilibrata. Confronta ora inquadratura, sfondo e momento dello scatto.");
  return { score: Math.max(35, Math.round(score)), exposure, contrast, sharpness, color, suggestions: suggestions.slice(0, 4) };
}

export function PhotoCoach() {
  const [goal, setGoal] = useState<Goal>("portrait");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const selectPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(""); setAnalysis(null);
    if (!file.type.startsWith("image/")) { setError("Seleziona un file immagine."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("La foto supera 20 MB. Esportane una copia più piccola e riprova."); return; }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file)); setFileName(file.name); setBusy(true);
    try { setAnalysis(await inspectPhoto(file, goal)); }
    catch { setError("Questo formato non può essere letto dal browser. Prova una copia JPEG, PNG o WebP."); }
    finally { setBusy(false); event.target.value = ""; }
  };

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
    <section className="premium-panel overflow-hidden">
      <div className="border-b border-[var(--line)] p-5 sm:p-7">
        <div className="flex items-center gap-2 text-[var(--cyan)]"><ShieldCheck size={18} aria-hidden="true" /><p className="font-mono text-xs uppercase tracking-[0.14em]">Analisi privata sul dispositivo</p></div>
        <h2 className="font-display mt-3 text-2xl font-semibold">Carica uno scatto da migliorare</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">La foto resta nel browser: non viene inviata né salvata online.</p>
        <label htmlFor="photo-goal" className="mt-5 block text-sm font-semibold">Che tipo di foto volevi ottenere?</label>
        <select id="photo-goal" value={goal} onChange={(event) => { setGoal(event.target.value as Goal); setAnalysis(null); }} className="mt-2 min-h-12 w-full border border-[var(--line-strong)] bg-[var(--ink)] px-4">
          {Object.entries(goals).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
        </select>
        <label className="mt-4 flex min-h-14 cursor-pointer items-center justify-center gap-2 bg-[var(--signal)] px-5 font-semibold text-[var(--ink)]">
          <ImagePlus size={19} aria-hidden="true" />{busy ? "Analisi in corso…" : preview ? "Scegli un’altra foto" : "Scegli una foto"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={selectPhoto} disabled={busy} className="sr-only" />
        </label>
        {error ? <p role="alert" className="mt-3 flex gap-2 text-sm text-[var(--danger)]"><TriangleAlert size={17} className="shrink-0" />{error}</p> : null}
      </div>
      {preview ? <div className="relative aspect-[4/3] bg-black"><Image src={preview} alt={`Anteprima di ${fileName}`} fill unoptimized className="object-contain" /></div> : <div className="surface-grid grid aspect-[4/3] place-items-center text-center text-[var(--muted)]"><div><Camera size={36} className="mx-auto text-[var(--signal)]" /><p className="mt-3 text-sm">Nessuna foto selezionata</p></div></div>}
    </section>

    <aside className="space-y-5">
      <section className="premium-panel p-5 sm:p-7">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--signal)]">Setup di partenza · {goals[goal].label}</p>
        <p className="mt-3 flex gap-2 text-sm leading-6"><Aperture size={18} className="mt-0.5 shrink-0 text-[var(--cyan)]" />{goals[goal].setup}</p>
      </section>
      {analysis ? <section className="premium-panel p-5 sm:p-7" aria-live="polite">
        <div className="flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--cyan)]">Lettura tecnica</p><h2 className="font-display mt-2 text-2xl font-semibold">Punteggio indicativo</h2></div><strong className="font-display text-4xl text-[var(--signal)]">{analysis.score}</strong></div>
        <dl className="mt-5 grid gap-px bg-[var(--line)] sm:grid-cols-2">{[["Luce",analysis.exposure],["Contrasto",analysis.contrast],["Dettaglio",analysis.sharpness],["Colore",analysis.color]].map(([label,value])=><div key={label} className="bg-[var(--ink)] p-3"><dt className="text-xs text-[var(--muted)]">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}</dl>
        <h3 className="mt-6 font-display text-lg font-semibold">Cosa provare sul prossimo scatto</h3>
        <ul className="mt-3 space-y-3">{analysis.suggestions.map((suggestion)=><li key={suggestion} className="flex gap-2 text-sm leading-6 text-[var(--muted)]"><CheckCircle2 size={17} className="mt-1 shrink-0 text-[var(--success)]" />{suggestion}</li>)}</ul>
      </section> : <section className="premium-panel p-5 text-sm leading-6 text-[var(--muted)]">Scegli l’obiettivo e una foto per ricevere indicazioni. Il punteggio valuta soltanto caratteristiche tecniche: non giudica il valore creativo dello scatto.</section>}
    </aside>
  </div>;
}
