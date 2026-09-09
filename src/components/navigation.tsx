"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, BookOpen, Box, Camera, Home, LibraryBig, PackageOpen } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", shortLabel: "Home", icon: Home },
  { href: "/academy", label: "Academy", shortLabel: "Academy", icon: BookOpen },
  { href: "/tutorials", label: "Guide di scatto", shortLabel: "Guide", icon: Camera },
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
                ? "border-[var(--signal)] bg-[var(--panel-raised)] text-[var(--paper)]"
                : "border-transparent text-[var(--muted)] hover:bg-white/[0.03] hover:text-[var(--paper)]"
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
    <nav aria-label="Navigazione mobile" className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-6 border-t border-[var(--line)] bg-[rgba(13,17,20,.97)] pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_35px_rgba(0,0,0,.35)] backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-[0.64rem] transition ${active ? "text-[var(--signal)]" : "text-[var(--muted)]"}`}
            aria-current={active ? "page" : undefined}
          >
            {active ? <span className="absolute inset-x-3 top-0 h-0.5 bg-[var(--signal)]" /> : null}
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
      <div className="border border-[var(--line)] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--paper)]">
          <LibraryBig size={17} className="text-[var(--cyan)]" aria-hidden="true" />
          <span>Fase 2 attiva</span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-5 text-[var(--muted)]">Academy e kit pronti. Il simulatore EOS R10 guida ora comandi e menu passo passo.</p>
      </div>
    </div>
  );
}
