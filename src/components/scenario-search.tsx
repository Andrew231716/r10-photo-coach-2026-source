"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Sparkles } from "lucide-react";

type SearchItem = { slug: string; title: string; category: string; summary: string };

export function ScenarioSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const match = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("it");
    if (!clean) return null;
    return items.find((tutorial) => `${tutorial.title} ${tutorial.category} ${tutorial.summary}`.toLocaleLowerCase("it").includes(clean));
  }, [items, query]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (match) router.push(`/tutorials/${match.slug}`);
    else router.push(`/tutorials?q=${encodeURIComponent(query.trim())}`);
  }

  const openSuggestion = (label: string) => {
    const found = items.find((tutorial) => tutorial.title.toLocaleLowerCase("it").includes(label.toLocaleLowerCase("it")));
    if (found) router.push(`/tutorials/${found.slug}`);
    else router.push(`/tutorials?q=${encodeURIComponent(label)}`);
  };

  return (
    <form onSubmit={submit} className="mt-6 max-w-2xl" role="search">
      <label htmlFor="scenario-search" className="mb-2 block text-sm font-semibold text-white/90">Descrivi la scena</label>
      <div className="flex min-h-14 overflow-hidden border border-white/25 bg-[var(--ink)]/90 shadow-2xl shadow-black/30 focus-within:border-[var(--signal)] sm:min-h-16">
        <Search className="ml-4 self-center text-[var(--muted)]" size={19} aria-hidden="true" />
        <input
          id="scenario-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Es. ritratto, luna, sport…"
          className="min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] text-[var(--paper)] outline-none placeholder:text-[#8a949a] sm:text-base"
        />
        <button type="submit" aria-label="Trova la guida" className="flex shrink-0 items-center justify-center gap-2 bg-[var(--signal)] px-4 font-semibold text-[var(--ink)] transition hover:bg-[var(--signal-strong)] sm:px-5">
          <span className="hidden sm:inline">Trova guida</span><ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs text-white/65">{match ? `Trovato: ${match.title}` : query ? "Cercherò le guide più vicine alla tua richiesta" : "Oppure scegli un esempio qui sotto"}</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Esempi rapidi">
        {["Ritratto", "Paesaggio", "Sport"].map((label) => <button key={label} type="button" onClick={() => openSuggestion(label)} className="inline-flex min-h-10 items-center gap-1.5 border border-white/20 bg-black/25 px-3 text-xs text-white/80 backdrop-blur transition hover:border-[var(--signal)] hover:text-white"><Sparkles size={13} className="text-[var(--signal)]" />{label}</button>)}
      </div>
    </form>
  );
}
