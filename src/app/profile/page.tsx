import type { Metadata } from "next";
import { ProfileManager } from "@/components/profile-manager";

export const metadata: Metadata = { title: "Profilo e sincronizzazione" };

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Profilo personale</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">I tuoi progressi, anche su un altro dispositivo.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Nessun abbonamento e nessun servizio esterno: basta conservare il codice personale di sincronizzazione.</p>
      </header>
      <ProfileManager />
    </div>
  );
}
