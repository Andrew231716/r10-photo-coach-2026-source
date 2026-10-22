"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, BookOpen, Box, Camera, Home, LibraryBig, PackageOpen, ScanSearch } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { href: "/", label: "Home", shortLabel: "Home", icon: Home },
  { href: "/academy", label: "Academy", shortLabel: "Academy", icon: BookOpen },
  { href: "/tutorials", label: "Guide di scatto", shortLabel: "Guide", icon: Camera },
  { href: "/coach", label: "Photo Coach", shortLabel: "Coach", icon: ScanSearch },
  { href: "/simulator", label: "Comandi fotocamera", shortLabel: "Comandi", icon: Box },
  { href: "/lenses", label: "Obiettivi", shortLabel: "Lenti", icon: Aperture },
  { href: "/gear", label: "Attrezzatura", shortLabel: "Kit", icon: PackageOpen },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione principale" className="mt-10 space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex min-h-12 items-center gap-3 border-l-2 px-4 text-[0.95rem] transition ${
              active
                ? "border-[var(--chrome-signal)] bg-white/[0.04] text-[var(--chrome-paper)]"
                : "border-transparent text-[var(--chrome-muted)] hover:bg-white/[0.03] hover:text-[var(--chrome-paper)]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={19} strokeWidth={active ? 2.1 : 1.65} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigazione mobile" className="chrome-surface fixed inset-x-0 bottom-0 z-[70] grid grid-cols-6 border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_35px_rgba(0,0,0,.35)] backdrop-blur-xl lg:hidden">
      {items.filter((item) => item.href !== "/lenses").map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-[0.64rem] transition ${
              active ? "text-[var(--chrome-signal)]" : "text-[var(--chrome-muted)]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {active ? <span className="absolute inset-x-3 top-0 h-0.5 bg-[var(--chrome-signal)]" /> : null}
            <Icon size={20} strokeWidth={active ? 2.2 : 1.7} aria-hidden="true" />
            <span>{item.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarUtilityLinks() {
  return (
    <div className="mt-auto space-y-2 px-4 pb-6 pt-8">
      <ThemeToggle variant="row" />
      <div className="border border-[var(--chrome-line)] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--chrome-paper)]">
          <LibraryBig size={17} className="text-[#55d4c6]" aria-hidden="true" />
          <span>Coach, guide e alert</span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-5 text-[var(--chrome-muted)]">
          Academy, chat coach, analisi privata, simulatore 3D e promemoria pratica. I progressi restano sul telefono e si sincronizzano se Neon è collegato.
        </p>
      </div>
    </div>
  );
}
