import type { Metadata } from "next";
import { CameraSimulatorLoader } from "@/components/camera-simulator/camera-simulator-loader";

export const metadata: Metadata = { title: "Simulatore EOS R10" };

export default function SimulatorPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Fase 2 · Laboratorio interattivo</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Impara i comandi con le mani.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">Ruota la EOS R10, seleziona un comando o descrivi cosa vuoi impostare. Il coach evidenzia il controllo corretto e costruisce la procedura passo dopo passo.</p>
      </header>
      <CameraSimulatorLoader />
      <p className="text-xs leading-5 text-[var(--muted)]">Disposizione e procedure verificate sul <a href="https://cam.start.canon/en/C006/manual/html/index.html" target="_blank" rel="noreferrer" className="text-[var(--paper)] underline decoration-[var(--line-strong)] underline-offset-4 hover:decoration-[var(--signal)]">manuale Canon EOS R10</a> per firmware 1.7.0 o successivo. Il modello è uno schema didattico interattivo, non una riproduzione CAD.</p>
    </div>
  );
}
