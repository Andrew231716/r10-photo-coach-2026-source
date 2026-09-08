"use client";

import { useMemo } from "react";
import { Aperture, Camera, Check, PackageOpen, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";
import { allGear, defaultGear } from "@/data/gear";

export function GearManager() {
  const { ownedGear: ownedIds, ready, storageMode, setOwnedGear } = useAppState();
  const owned = useMemo(() => allGear.filter((item) => ownedIds.includes(item.id)), [ownedIds]);
  const available = useMemo(() => allGear.filter((item) => !ownedIds.includes(item.id)), [ownedIds]);
  function save(ids: string[]) { setOwnedGear(ids); }
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <section className="border border-[var(--line)] bg-[var(--panel)]"><div className="flex items-center justify-between border-b border-[var(--line)] p-5 sm:p-6"><div><p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--signal)]">Il tuo kit</p><h2 className="font-display mt-1 text-2xl font-semibold">{owned.length} elementi</h2><p className="mt-1 text-xs text-[var(--muted)]">{storageMode === "database" ? "Sincronizzato su database" : "Salvato sul dispositivo"}</p></div><button onClick={() => save(defaultGear.map((item) => item.id))} disabled={!ready} className="flex min-h-10 items-center gap-2 border border-[var(--line)] px-3 text-xs text-[var(--muted)] hover:text-[var(--paper)] disabled:cursor-wait disabled:opacity-60"><RotateCcw size={14} /> Ripristina</button></div><div className="divide-y divide-[var(--line)]">{owned.map((item) => { const Icon = item.kind === "Fotocamera" ? Camera : item.kind === "Obiettivo" ? Aperture : PackageOpen; return <div key={item.id} className="flex items-center gap-4 p-5"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.04] text-[var(--signal)]"><Icon size={19} /></span><div className="min-w-0 flex-1"><div className="font-semibold">{item.name}</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.detail}</div></div>{item.id !== "eos-r10" ? <button onClick={() => save(ownedIds.filter((id) => id !== item.id))} disabled={!ready} aria-label={`Rimuovi ${item.name}`} className="grid size-10 place-items-center text-[var(--muted)] hover:text-[var(--danger)] disabled:cursor-wait disabled:opacity-60"><Trash2 size={17} /></button> : <Check size={17} className="text-[var(--success)]" />}</div>; })}</div></section>
      <aside className="border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6"><p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--cyan)]">Aggiungi al profilo</p><h2 className="font-display mt-2 text-2xl font-semibold">Altra attrezzatura</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Il Coach userà questi dati per privilegiare sempre ciò che possiedi.</p><div className="mt-5 space-y-3">{available.map((item) => <button key={item.id} onClick={() => save([...ownedIds, item.id])} disabled={!ready} className="flex w-full items-center gap-3 border border-[var(--line)] p-3 text-left transition hover:border-[var(--line-strong)] disabled:cursor-wait disabled:opacity-60"><Plus size={16} className="shrink-0 text-[var(--signal)]" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{item.name}</span><span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{item.detail}</span></span></button>)}{!available.length ? <div className="border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">Hai aggiunto tutto il catalogo iniziale.</div> : null}</div></aside>
    </div>
  );
}
