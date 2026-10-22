"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useAppState } from "@/components/app-state-provider";
import {
  buildProgressNotifications,
  defaultPrefs,
  maybePushPracticeReminder,
  mergeNotifications,
  readNotifications,
  readPrefs,
  requestBrowserPermission,
  writeNotifications,
  writePrefs,
  type AppNotification,
  type NotificationPrefs,
} from "@/lib/notifications";

export function NotificationCenter() {
  const { ready, academyCompleted, tutorialsCompleted } = useAppState();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [status, setStatus] = useState("");
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ready) return;
    const existing = readNotifications();
    const generated = buildProgressNotifications({ academyCompleted, tutorialsCompleted });
    const next = mergeNotifications(existing, generated);
    writeNotifications(next);
    setItems(next);
    const nextPrefs = readPrefs();
    setPrefs(nextPrefs);
    void maybePushPracticeReminder(nextPrefs);
  }, [ready, academyCompleted, tutorialsCompleted]);

  useEffect(() => {
    if (!open) return;
    const panel = rootRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex]:not([tabindex='-1'])"))
      : [];
    focusables[0]?.focus();

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusables.length < 2) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unread = items.filter((item) => !item.read).length;

  const markAllRead = () => {
    const next = items.map((item) => ({ ...item, read: true }));
    setItems(next);
    writeNotifications(next);
  };

  const enableBrowser = async () => {
    const permission = await requestBrowserPermission();
    if (permission === "granted") {
      const next = { ...prefs, browserEnabled: true };
      setPrefs(next);
      writePrefs(next);
      setStatus("Notifiche browser attive. Ti ricorderemo la pratica quotidiana.");
      void maybePushPracticeReminder(next);
      return;
    }
    if (permission === "denied") {
      setStatus("Permesso negato dal browser. Puoi riattivarlo dalle impostazioni del sito.");
      return;
    }
    setStatus("Questo browser non supporta le notifiche.");
  };

  const toggleDaily = () => {
    const next = { ...prefs, dailyPractice: !prefs.dailyPractice };
    setPrefs(next);
    writePrefs(next);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={unread ? `Notifiche, ${unread} non lette` : "Notifiche"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-10 place-items-center border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--paper)]"
      >
        <Bell size={18} aria-hidden="true" />
        {unread ? (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Centro notifiche"
          className="absolute right-0 top-[calc(100%+0.55rem)] z-[80] w-[min(22rem,calc(100vw-1.5rem))] border border-[var(--line-strong)] bg-[var(--carbon)] shadow-[0_24px_70px_rgba(0,0,0,.45)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--cyan)]">Notifiche</p>
              <p className="text-sm text-[var(--paper)]">{unread ? `${unread} da leggere` : "Tutto letto"}</p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--paper)]"
            >
              <CheckCheck size={14} aria-hidden="true" /> Segna lette
            </button>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {items.length ? items.map((item) => (
              <li key={item.id} className="border-b border-[var(--line)] last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => {
                    const next = items.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry);
                    setItems(next);
                    writeNotifications(next);
                    setOpen(false);
                  }}
                  className="block px-4 py-3 transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-1 size-2 shrink-0 rounded-full ${item.read ? "bg-[var(--line-strong)]" : "bg-[var(--signal)]"}`} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--paper)]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.body}</p>
                    </div>
                  </div>
                </Link>
              </li>
            )) : (
              <li className="px-4 py-6 text-sm text-[var(--muted)]">Nessun avviso al momento.</li>
            )}
          </ul>

          <div className="space-y-3 border-t border-[var(--line)] px-4 py-3">
            <label className="flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <span>Promemoria pratica quotidiana</span>
              <input type="checkbox" checked={prefs.dailyPractice} onChange={toggleDaily} />
            </label>
            {prefs.browserEnabled ? (
              <p className="inline-flex items-center gap-2 text-xs text-[var(--success)]">
                <Bell size={14} aria-hidden="true" /> Notifiche browser attive
              </p>
            ) : (
              <button
                type="button"
                onClick={() => void enableBrowser()}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[var(--line-strong)] text-xs font-semibold text-[var(--paper)]"
              >
                <BellOff size={14} aria-hidden="true" /> Attiva notifiche browser
              </button>
            )}
            {status ? <p className="text-xs leading-5 text-[var(--muted)]">{status}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
