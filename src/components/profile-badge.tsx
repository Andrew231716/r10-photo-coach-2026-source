"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Aperture } from "lucide-react";

export function ProfileBadge() {
  const [name, setName] = useState("Profilo");

  useEffect(() => {
    let active = true;
    void fetch("/api/account", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<{ account?: { displayName?: string } }> : null)
      .then((payload) => { if (active && payload?.account?.displayName) setName(payload.account.displayName); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const initials = name === "Profilo" ? "R10" : name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <Link href="/profile" className="flex shrink-0 items-center gap-3" aria-label="Apri profilo e sincronizzazione">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--signal)] text-[0.7rem] font-bold text-[var(--ink)]">{initials}</span>
      <span className="hidden leading-tight sm:block">
        <span className="block max-w-28 truncate text-sm font-semibold">{name}</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted)]"><Aperture size={12} aria-hidden="true" /> Esploratore</span>
      </span>
    </Link>
  );
}
