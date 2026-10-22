"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import type { Tutorial } from "@/types/content";

export function ShareSetup({ tutorial }: { tutorial: Tutorial }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = [
      `Setup EOS R10 · ${tutorial.title}`,
      `Modalità ${tutorial.settings.mode} · ${tutorial.settings.aperture} · ${tutorial.settings.shutter} · ${tutorial.settings.iso}`,
      `AF ${tutorial.settings.autofocus} · ${tutorial.settings.subjectDetection} · Eye ${tutorial.settings.eyeDetection}`,
      tutorial.summary,
      window.location.href,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({ title: `R10 · ${tutorial.title}`, text, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex min-h-11 items-center gap-2 border border-[var(--line-strong)] px-4 text-sm text-[var(--paper)] transition hover:border-[var(--signal)]"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      {copied ? "Setup copiato" : "Condividi setup"}
    </button>
  );
}
