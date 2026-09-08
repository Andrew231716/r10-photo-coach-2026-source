"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

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

  return (
    <form onSubmit={submit} className="mt-7 max-w-xl" role="search">
      <label htmlFor="scenario-search" className="sr-only">Cerca cosa vuoi fotografare</label>
      <div className="flex min-h-14 overflow-hidden border border-white/20 bg-[var(--ink)]/85 shadow-2xl shadow-black/20 focus-within:border-[var(--signal)]">
        <Search className="ml-4 self-center text-[var(--muted)]" size={19} aria-hidden="true" />
        <input
          id="scenario-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Es. ritratto al tramonto, luna, sport…"
          className="min-w-0 flex-1 bg-transparent px-3 text-base text-[var(--paper)] outline-none placeholder:text-[#7f888e]"
        />
        <button type="submit" aria-label="Apri il tutorial" className="grid w-14 place-items-center bg-[var(--signal)] text-[var(--ink)] transition hover:bg-[var(--signal-strong)]">
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-xs text-white/60">{match ? `Apri: ${match.title}` : query ? "Esplorerò tutti i tutorial correlati" : "Descrivi il soggetto o la situazione"}</p>
    </form>
  );
}
