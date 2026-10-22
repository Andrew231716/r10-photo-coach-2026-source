"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiCoachChat } from "@/components/ai-coach-chat";
import { PhotoCoach } from "@/components/photo-coach";

const tabs = [
  { id: "analisi", label: "Analizza una foto" },
  { id: "chat", label: "Chiedi al coach" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function resolveTab(value: string | null): TabId {
  return value === "chat" ? "chat" : "analisi";
}

export function CoachWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<TabId>(() => resolveTab(searchParams.get("tab")));

  useEffect(() => {
    setTab(resolveTab(searchParams.get("tab")));
  }, [searchParams]);

  const selectTab = (next: TabId) => {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "analisi") params.delete("tab");
    else params.set("tab", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Modalità Photo Coach" className="flex flex-wrap gap-2">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectTab(item.id)}
              className={`min-h-11 px-4 text-sm font-semibold transition ${
                active
                  ? "bg-[var(--signal)] text-[var(--ink)]"
                  : "border border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--paper)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {tab === "chat" ? <AiCoachChat /> : <PhotoCoach />}
    </div>
  );
}
