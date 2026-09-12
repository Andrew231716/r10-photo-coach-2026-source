import type { Metadata } from "next";
import { ProfileManager } from "@/components/profile-manager";
import { SaveStatus } from "@/components/save-status";

export const metadata: Metadata = { title: "Profilo e sincronizzazione" };

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Profilo personale</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">I tuoi progressi, anche su un altro dispositivo.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">Conserva il codice personale per recuperare il profilo. La sincronizzazione usa il database collegato all’app.</p>
      </header>
      <SaveStatus />
      <ProfileManager />
    </div>
  );
}
