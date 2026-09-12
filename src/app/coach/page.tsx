import type { Metadata } from "next";
import { PhotoCoach } from "@/components/photo-coach";

export const metadata: Metadata = { title: "Photo Coach" };

export default function CoachPage() {
  return <div className="space-y-8">
    <header className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Laboratorio foto</p><h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Capisci cosa migliorare, poi riscattala.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Un controllo tecnico immediato dello scatto con consigli pratici per la tua EOS R10. Gratuito e senza caricare la foto online.</p></header>
    <PhotoCoach />
  </div>;
}
