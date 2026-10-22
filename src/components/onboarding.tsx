"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { BookOpen, Camera, ScanSearch, X } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";

const paths = [
  { href: "/academy/", title: "Voglio imparare", text: "Academy in ordine, dalle basi.", icon: BookOpen },
  { href: "/tutorials/", title: "Mi serve un setup", text: "Guide pronte per la scena.", icon: Camera },
  { href: "/coach/?tab=chat", title: "Ho una domanda", text: "Chiedi al coach della R10.", icon: ScanSearch },
];

export function Onboarding() {
  const { ready, onboardingDone, completeOnboarding } = useAppState();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ready || onboardingDone) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [ready, onboardingDone]);

  if (!ready || onboardingDone) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-end bg-black/70 p-4 sm:place-items-center"
      role="presentation"
      onClick={completeOnboarding}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg border border-[var(--line-strong)] bg-[var(--carbon)] p-5 shadow-[0_30px_90px_rgba(0,0,0,.55)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Benvenuto</p>
            <h2 id={titleId} className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Cosa vuoi fotografare oggi?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Tre percorsi gratuiti. Puoi cambiare idea quando vuoi dalla dashboard.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={completeOnboarding}
            className="grid size-10 place-items-center border border-[var(--line)] text-[var(--muted)]"
            aria-label="Chiudi introduzione"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-2">
          {paths.map(({ href, title, text, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={completeOnboarding}
              className="flex min-h-16 items-center gap-3 border border-[var(--line)] px-4 py-3 transition hover:border-[var(--signal)]"
            >
              <span className="grid size-10 place-items-center border border-[var(--line-strong)] text-[var(--signal)]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--paper)]">{title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">{text}</span>
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={completeOnboarding}
          className="mt-5 w-full min-h-12 bg-[var(--signal)] font-semibold text-[var(--ink)]"
        >
          Entra nella dashboard
        </button>
      </div>
    </div>
  );
}
