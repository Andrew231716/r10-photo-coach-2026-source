import Link from "next/link";
import { Search } from "lucide-react";
import { DesktopNavigation, MobileNavigation, SidebarUtilityLinks } from "@/components/navigation";
import { NotificationCenter } from "@/components/notification-center";
import { Onboarding } from "@/components/onboarding";
import { PwaRegister } from "@/components/pwa-register";
import { AppStateProvider } from "@/components/app-state-provider";
import { ProfileBadge } from "@/components/profile-badge";
import { ThemeToggle } from "@/components/theme-toggle";

export function Brand() {
  return (
    <Link href="/" className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3" aria-label="R10 Photo Coach, dashboard">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-[0.7rem] border border-[#3b444b] bg-[#070809]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" width={40} height={40} className="size-full object-cover" />
      </span>
      <span className="min-w-0 truncate font-display text-base font-semibold tracking-[-0.02em] text-[#f3f0e8] sm:text-[1.05rem]">
        R10 <span className="text-[#f0b323]">Photo Coach</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <div className="min-h-screen">
        <PwaRegister />
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[var(--chrome-line)] bg-[var(--chrome-solid)] text-[var(--chrome-paper)] lg:flex">
          <div className="px-6 pt-6"><Brand /></div>
          <DesktopNavigation />
          <SidebarUtilityLinks />
        </aside>

        <div className="lg:pl-[248px]">
          <header className="chrome-surface sticky top-0 z-[70] isolate border-b pt-[env(safe-area-inset-top)] shadow-[0_8px_30px_rgba(0,0,0,.24)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-2 px-3 min-[390px]:px-4 sm:gap-4 sm:px-7 lg:px-10">
              <div className="min-w-0 shrink lg:hidden"><Brand /></div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <Link
                  href="/tutorials"
                  className="hidden min-h-10 items-center gap-2 border border-[var(--chrome-line)] bg-white/[0.02] px-3 text-sm text-[var(--chrome-muted)] transition hover:border-[var(--chrome-line-strong)] hover:text-[var(--chrome-paper)] sm:flex"
                >
                  <Search size={16} aria-hidden="true" /> Cerca un tutorial
                </Link>
                <ThemeToggle />
                <div className="hidden sm:block"><NotificationCenter /></div>
                <ProfileBadge />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1500px] px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pt-8 lg:px-10 lg:pb-14">
            {children}
          </main>
        </div>
        <MobileNavigation />
        <Onboarding />
      </div>
    </AppStateProvider>
  );
}
