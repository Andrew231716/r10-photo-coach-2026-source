"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy, Database, KeyRound, LogIn, LogOut, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";

type Account = { id: string; displayName: string; lastSyncedAt?: string | null };

export function ProfileManager() {
  const state = useAppState();
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<"loading" | "local" | "database">("loading");
  const [displayName, setDisplayName] = useState("");
  const [syncCode, setSyncCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    void fetch("/api/account", { cache: "no-store" })
      .then(async (response) => response.json() as Promise<{ mode?: "local" | "database"; account?: Account | null }>)
      .then((payload) => { setMode(payload.mode ?? "local"); setAccount(payload.account ?? null); })
      .catch(() => setMode("local"));
  }, []);

  const request = async (body: Record<string, unknown>) => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json() as { error?: string; displayName?: string; syncCode?: string };
      if (!response.ok) throw new Error(payload.error === "invalid_sync_code" ? "Codice non riconosciuto." : "Sincronizzazione non disponibile.");
      return payload;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operazione non riuscita.");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const createProfile = async (event: FormEvent) => {
    event.preventDefault();
    const payload = await request({ action: "create", displayName, state });
    if (!payload?.syncCode) return;
    setAccount({ id: "current", displayName: payload.displayName ?? displayName });
    setNewCode(payload.syncCode);
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    const payload = await request({ action: "signin", syncCode });
    if (!payload) return;
    window.location.reload();
  };

  const signOut = async () => {
    const payload = await request({ action: "signout" });
    if (payload) window.location.reload();
  };

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    const payload = await request({ action: "rename", displayName });
    if (!payload?.displayName) return;
    setAccount((current) => current ? { ...current, displayName: payload.displayName ?? current.displayName } : current);
    setEditingName(false);
    setMessage("Nome aggiornato.");
  };

  const regenerateCode = async () => {
    if (!window.confirm("Il vecchio codice smetterà di funzionare. Vuoi generarne uno nuovo?")) return;
    const payload = await request({ action: "rotate_code" });
    if (payload?.syncCode) {
      setNewCode(payload.syncCode);
      setMessage("Nuovo codice generato. Salvalo ora.");
    }
  };

  const removeProfile = async () => {
    if (deleteConfirmation !== "ELIMINA") return;
    if (!window.confirm("Eliminare definitivamente profilo e progressi sincronizzati?")) return;
    const payload = await request({ action: "delete", syncCode: deleteConfirmation });
    if (payload) window.location.reload();
  };

  if (mode === "loading") return <div className="premium-panel p-6 text-sm text-[var(--muted)]">Controllo sincronizzazione…</div>;
  if (mode === "local") return (
    <div className="premium-panel p-6 sm:p-8">
      <Database className="text-[var(--signal)]" />
      <h2 className="font-display mt-4 text-2xl font-semibold">Salvataggio locale attivo</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">I progressi restano protetti su questo dispositivo. Per usare il profilo su più dispositivi occorre configurare <code>DATABASE_URL</code> su Vercel.</p>
    </div>
  );

  if (account) return (
    <div className="space-y-5">
    <div className="premium-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--cyan)]">Profilo sincronizzato</p><h2 className="font-display mt-2 text-3xl font-semibold">{account.displayName}</h2><p className="mt-2 text-xs text-[var(--muted)]">Ultimo salvataggio: {account.lastSyncedAt ? new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(account.lastSyncedAt)) : "in attesa del primo progresso"}</p></div>
        <span className="inline-flex items-center gap-2 border border-[var(--success)]/45 bg-[var(--success)]/10 px-3 py-2 text-xs text-[var(--success)]"><Check size={15} /> Database attivo</span>
      </div>
      {newCode ? <div className="mt-7 border border-[var(--signal)]/55 bg-[var(--signal)]/10 p-5"><p className="text-sm font-semibold">Salva adesso il tuo codice personale</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Viene mostrato una sola volta. Ti servirà per recuperare il profilo su un altro dispositivo.</p><div className="mt-4 flex flex-wrap items-center gap-3"><code className="bg-[var(--ink)] px-4 py-3 font-mono text-base tracking-[0.08em] text-[var(--signal-strong)]">{newCode}</code><button type="button" onClick={() => void navigator.clipboard.writeText(newCode)} className="inline-flex min-h-11 items-center gap-2 border border-[var(--line-strong)] px-4 text-sm"><Copy size={16} /> Copia</button></div></div> : null}
      <p className="mt-6 flex gap-2 text-sm text-[var(--muted)]"><ShieldCheck size={18} className="shrink-0 text-[var(--cyan)]" /> Academy, tutorial e attrezzatura vengono salvati online e restano disponibili su questo dispositivo.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={() => { setDisplayName(account.displayName); setEditingName((value) => !value); }} className="inline-flex min-h-11 items-center gap-2 border border-[var(--line)] px-4 text-sm"><Pencil size={16} /> Modifica nome</button>
        <button type="button" onClick={regenerateCode} disabled={busy} className="inline-flex min-h-11 items-center gap-2 border border-[var(--line)] px-4 text-sm"><KeyRound size={16} /> Nuovo codice</button>
        <button type="button" onClick={signOut} disabled={busy} className="inline-flex min-h-11 items-center gap-2 border border-[var(--line)] px-4 text-sm text-[var(--muted)] hover:text-[var(--paper)]"><LogOut size={16} /> Esci</button>
      </div>
      {editingName ? <form onSubmit={saveName} className="mt-5 flex flex-col gap-3 sm:flex-row"><label htmlFor="edit-display-name" className="sr-only">Nuovo nome visualizzato</label><input id="edit-display-name" required maxLength={40} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="min-h-11 flex-1 border border-[var(--line-strong)] bg-[var(--ink)] px-4 outline-none focus:border-[var(--signal)]" /><button disabled={busy} className="min-h-11 bg-[var(--signal)] px-5 font-semibold text-[var(--ink)]">Salva</button></form> : null}
      {message ? <p role="status" className="mt-4 text-sm text-[var(--cyan)]">{message}</p> : null}
    </div>
    <div className="border border-[var(--danger)]/35 bg-[var(--danger)]/5 p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold">Elimina profilo</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Rimuove definitivamente il profilo e i progressi online. I dati locali di questo dispositivo non vengono cancellati.</p>
      <label htmlFor="delete-confirmation" className="mt-5 block text-sm font-semibold">Scrivi ELIMINA per confermare</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row"><input id="delete-confirmation" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value.toUpperCase())} className="min-h-11 flex-1 border border-[var(--danger)]/45 bg-[var(--ink)] px-4 font-mono outline-none" /><button type="button" onClick={removeProfile} disabled={busy || deleteConfirmation !== "ELIMINA"} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--danger)] px-5 text-sm text-[var(--danger)] disabled:opacity-35"><Trash2 size={16} /> Elimina definitivamente</button></div>
    </div>
    </div>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={createProfile} className="premium-panel p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--signal)]">Nuovo profilo</p>
        <h2 className="font-display mt-3 text-2xl font-semibold">Porta i progressi con te</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Crea un profilo gratuito. I progressi presenti sul dispositivo saranno collegati automaticamente.</p>
        <label htmlFor="display-name" className="mt-6 block text-sm font-semibold">Nome visualizzato</label>
        <input id="display-name" required maxLength={40} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Es. Andrea" className="mt-2 min-h-12 w-full border border-[var(--line-strong)] bg-[var(--ink)] px-4 outline-none focus:border-[var(--signal)]" />
        <button disabled={busy} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--signal)] px-4 font-semibold text-[var(--ink)] disabled:opacity-50">Crea e sincronizza <ShieldCheck size={17} /></button>
      </form>
      <form onSubmit={signIn} className="premium-panel p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--cyan)]">Hai già un profilo?</p>
        <h2 className="font-display mt-3 text-2xl font-semibold">Recuperalo con il codice</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Inserisci il codice personale ricevuto alla creazione del profilo.</p>
        <label htmlFor="sync-code" className="mt-6 block text-sm font-semibold">Codice di sincronizzazione</label>
        <input id="sync-code" required autoCapitalize="characters" value={syncCode} onChange={(event) => setSyncCode(event.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" className="mt-2 min-h-12 w-full border border-[var(--line-strong)] bg-[var(--ink)] px-4 font-mono uppercase outline-none focus:border-[var(--cyan)]" />
        <button disabled={busy} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[var(--cyan)] px-4 font-semibold text-[var(--paper)] disabled:opacity-50">Accedi e recupera <LogIn size={17} /></button>
      </form>
      {message ? <p role="alert" className="lg:col-span-2 text-sm text-[var(--danger)]">{message}</p> : null}
    </div>
  );
}
