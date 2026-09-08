import Link from "next/link";
import { Aperture, Bell, Search } from "lucide-react";
import { DesktopNavigation, MobileNavigation, SidebarUtilityLinks } from "@/components/navigation";
import { PwaRegister } from "@/components/pwa-register";
import { AppStateProvider } from "@/components/app-state-provider";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="R10 Photo Coach, dashboard">
      <span className="grid size-10 place-items-center rounded-full border border-[var(--signal)] font-mono text-xs font-semibold text-[var(--signal)]">R10</span>
      <span className="font-display text-[1.05rem] font-semibold tracking-[-0.02em]">Photo <span className="text-[var(--signal)]">Coach</span></span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider><div className="min-h-screen">
      <PwaRegister />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[var(--line)] bg-[var(--carbon)] lg:flex">
        <div className="px-6 pt-6"><Brand /></div>
        <DesktopNavigation />
        <SidebarUtilityLinks />
      </aside>

      <div className="lg:pl-[248px]">
        <header className="glass sticky top-0 z-30 border-b border-[var(--line)]">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-7 lg:px-10">
            <div className="lg:hidden"><Brand /></div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/tutorials" className="hidden min-h-10 items-center gap-2 border border-[var(--line)] bg-white/[0.02] px-3 text-sm text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--paper)] sm:flex">
                <Search size={16} aria-hidden="true" /> Cerca un tutorial
              </Link>
              <button type="button" disabled aria-label="Notifiche, prossimamente" title="Notifiche disponibili nella Fase 4" className="grid size-10 cursor-not-allowed place-items-center border border-[var(--line)] text-[var(--muted)] opacity-60">
                <Bell size={18} aria-hidden="true" />
              </button>
              <div className="hidden items-center gap-3 pl-2 sm:flex">
                <span className="grid size-9 place-items-center rounded-full bg-[var(--signal)] text-sm font-bold text-[var(--ink)]">JM</span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Jude</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted)]"><Aperture size={12} aria-hidden="true" /> Esploratore</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14">{children}</main>
      </div>
      <MobileNavigation />
    </div></AppStateProvider>
  );
}
