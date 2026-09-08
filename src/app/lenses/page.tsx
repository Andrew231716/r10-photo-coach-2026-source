import type { Metadata } from "next";
import { LensCatalog } from "@/components/lens-catalog";

export const metadata: Metadata = { title: "Catalogo obiettivi" };
export default function LensesPage() { return <div><header className="mb-8 max-w-4xl"><p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">RF e RF-S per APS-C</p><h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Prima usa ciò che hai. Poi scegli per un limite reale.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Il catalogo mette sempre in evidenza i tuoi due obiettivi e traduce ogni focale nel campo equivalente sulla EOS R10.</p></header><LensCatalog /></div>; }
