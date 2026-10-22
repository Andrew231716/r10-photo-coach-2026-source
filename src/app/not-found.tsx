import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center py-10">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
        Questa pagina non è in catalogo
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">
        Il percorso non esiste o è stato spostato. Torna alla dashboard oppure scegli Academy, guide o simulatore.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center gap-2 bg-[var(--signal)] px-5 font-semibold text-[var(--ink)]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Dashboard
        </Link>
        <Link
          href="/tutorials"
          className="inline-flex min-h-12 items-center gap-2 border border-[var(--line-strong)] px-5 text-[var(--paper)]"
        >
          <Compass size={17} aria-hidden="true" />
          Guide di scatto
        </Link>
      </div>
    </div>
  );
}
