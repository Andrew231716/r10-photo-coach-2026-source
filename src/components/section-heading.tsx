import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, eyebrow, href, linkLabel = "Vedi tutto" }: { title: string; eyebrow?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="font-mono mb-2 text-xs uppercase tracking-[0.16em] text-[var(--signal)]">{eyebrow}</p> : null}
        <h2 className="font-display text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="flex min-h-10 shrink-0 items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--paper)]">
          {linkLabel}<ArrowRight size={15} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
