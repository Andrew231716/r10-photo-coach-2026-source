"use client";

import { useAppState } from "@/components/app-state-provider";

export function SaveStatus() {
  const { syncStatus, localStorageError } = useAppState();
  const labels = {
    checking: "Verifica del salvataggio…",
    saving: "Salvataggio online in corso…",
    saved: "Progressi salvati online",
    error: "Salvataggio online non confermato. Controlla la connessione.",
    local: "Modalità locale: sincronizzazione online non disponibile.",
  };
  return <aside className="premium-panel p-4 text-sm" role="status" aria-live="polite">
    <p className={syncStatus === "error" ? "text-[var(--signal)]" : "text-[var(--muted)]"}>{labels[syncStatus]}</p>
    {localStorageError ? <p className="mt-2 text-[var(--danger)]">Il browser non riesce a conservare i progressi sul dispositivo. Non chiudere la pagina finché il salvataggio online non è confermato.</p> : syncStatus === "error" ? <p className="mt-2 text-[var(--muted)]">Le modifiche restano sul dispositivo. La sincronizzazione verrà ritentata alla prossima modifica o riapertura dell’app.</p> : null}
  </aside>;
}
