import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Tutorial } from "@/types/content";

export type TutorialCardData = Pick<Tutorial, "slug" | "symbol" | "category" | "difficulty" | "title" | "summary" | "minutes" | "ownedLens">;

export function TutorialCard({ tutorial, compact = false }: { tutorial: TutorialCardData; compact?: boolean }) {
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="group flex h-full flex-col border border-[var(--line)] bg-[var(--panel)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[var(--panel-raised)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] font-mono text-xs font-semibold text-[var(--signal)]">{tutorial.symbol}</span>
        <ArrowUpRight size={18} className="text-[var(--muted)] transition group-hover:text-[var(--signal)]" aria-hidden="true" />
      </div>
      <div className="mt-7 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--muted)]">
        <span>{tutorial.category}</span><span aria-hidden="true">·</span><span>{tutorial.difficulty}</span>
      </div>
      <h3 className="font-display mt-2 text-xl font-semibold tracking-[-0.025em]">{tutorial.title}</h3>
      {!compact ? <p className="mt-3 flex-1 text-[0.92rem] leading-6 text-[var(--muted)]">{tutorial.summary}</p> : <div className="flex-1" />}
      <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5"><Clock3 size={14} aria-hidden="true" />{tutorial.minutes} min</span>
        <span className="max-w-[65%] truncate text-right text-[var(--cyan)]">{tutorial.ownedLens}</span>
      </div>
    </Link>
  );
}
