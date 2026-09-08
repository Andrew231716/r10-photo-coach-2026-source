"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { TutorialCard, type TutorialCardData } from "@/components/tutorial-card";

export function TutorialExplorer({ items, categories, initialQuery = "" }: { items: TutorialCardData[]; categories: string[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("Tutti");

  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) setQuery(urlQuery);
  }, []);
  const filtered = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("it");
    return items.filter((tutorial) => {
      const categoryMatch = category === "Tutti" || tutorial.category === category;
      const queryMatch = !clean || `${tutorial.title} ${tutorial.category} ${tutorial.summary} ${tutorial.ownedLens}`.toLocaleLowerCase("it").includes(clean);
      return categoryMatch && queryMatch;
    });
  }, [category, items, query]);

  return (
    <div>
      <div className="sticky top-[65px] z-20 -mx-4 border-y border-[var(--line)] bg-[var(--ink)]/95 px-4 py-4 backdrop-blur sm:-mx-7 sm:px-7 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="flex min-h-12 flex-1 items-center gap-3 border border-[var(--line)] bg-[var(--panel)] px-4 focus-within:border-[var(--signal)]">
            <Search size={18} className="text-[var(--muted)]" aria-hidden="true" /><span className="sr-only">Cerca tutorial</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca situazione, tecnica o obiettivo…" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted)]" />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:max-w-[55%]">
            <SlidersHorizontal size={17} className="mr-1 shrink-0 text-[var(--muted)]" aria-hidden="true" />
            {["Tutti", ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} className={`min-h-10 shrink-0 border px-3 text-sm ${category === item ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--ink)]" : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--paper)]"}`}>{item}</button>)}
          </div>
        </div>
      </div>
      <p className="my-5 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{filtered.length} tutorial trovati</p>
      {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} />)}</div> : <div className="border border-dashed border-[var(--line-strong)] p-10 text-center"><p className="font-display text-xl">Nessun tutorial corrisponde alla ricerca.</p><button onClick={() => { setQuery(""); setCategory("Tutti"); }} className="mt-4 text-sm text-[var(--signal)]">Azzera i filtri</button></div>}
    </div>
  );
}
