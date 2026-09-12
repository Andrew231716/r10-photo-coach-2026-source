"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultAppState, normalizeAppState, type AppState } from "@/lib/app-state";

type StorageMode = "local" | "database";
type AppStateContextValue = AppState & {
  ready: boolean;
  storageMode: StorageMode;
  syncStatus: "checking" | "saving" | "saved" | "error" | "local";
  localStorageError: boolean;
  toggleAcademyModule: (id: string) => void;
  toggleTutorial: (slug: string) => void;
  setOwnedGear: (ids: string[]) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);
const storageKeys = {
  academyCompleted: "r10-academy-progress",
  tutorialsCompleted: "r10-completed-tutorials",
  ownedGear: "r10-owned-gear",
  updatedAt: "r10-state-updated-at",
} as const;

function readList(key: string, fallback: string[]) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function readLocalState() {
  const updatedAt = Number(localStorage.getItem(storageKeys.updatedAt) ?? 0);
  return normalizeAppState({
    academyCompleted: readList(storageKeys.academyCompleted, defaultAppState.academyCompleted),
    tutorialsCompleted: readList(storageKeys.tutorialsCompleted, defaultAppState.tutorialsCompleted),
    ownedGear: readList(storageKeys.ownedGear, defaultAppState.ownedGear),
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
  });
}

function saveLocalState(state: AppState) {
  localStorage.setItem(storageKeys.academyCompleted, JSON.stringify(state.academyCompleted));
  localStorage.setItem(storageKeys.tutorialsCompleted, JSON.stringify(state.tutorialsCompleted));
  localStorage.setItem(storageKeys.ownedGear, JSON.stringify(state.ownedGear));
  localStorage.setItem(storageKeys.updatedAt, String(state.updatedAt));
}

async function saveDatabaseState(state: AppState) {
  const response = await fetch("/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
    signal: AbortSignal.timeout(15000),
  });
  return response.ok;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);
  const [ready, setReady] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("local");
  const [syncStatus, setSyncStatus] = useState<AppStateContextValue["syncStatus"]>("checking");
  const [localStorageError, setLocalStorageError] = useState(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const stateRef = useRef(state);

  const persistLocal = useCallback((next: AppState) => {
    try { saveLocalState(next); setLocalStorageError(false); }
    catch { setLocalStorageError(true); }
  }, []);

  const persistRemote = useCallback((next: AppState) => {
    setSyncStatus("saving");
    saveQueue.current = saveQueue.current.then(async () => {
      try {
        const saved = await saveDatabaseState(next);
        if (saved) setStorageMode("database");
        if (stateRef.current === next) setSyncStatus(saved ? "saved" : "error");
      } catch {
        if (stateRef.current === next) setSyncStatus("error");
      }
    });
    return saveQueue.current;
  }, []);

  useEffect(() => {
    let active = true;
    let localState = defaultAppState;
    try { localState = readLocalState(); }
    catch { setLocalStorageError(true); }
    stateRef.current = localState;
    setState(localState);
    setReady(true);

    void fetch("/api/state", { cache: "no-store", signal: AbortSignal.timeout(15000) })
      .then(async (response) => {
        if (!response.ok) throw new Error("sync_unavailable");
        return response.json() as Promise<{ mode?: string; found?: boolean; state?: unknown }>;
      })
      .then(async (payload) => {
        if (!active) return;
        if (payload?.mode !== "database") { setSyncStatus("local"); return; }
        setStorageMode("database");

        if (!payload.found) {
          await persistRemote(stateRef.current);
          return;
        }

        const remoteState = normalizeAppState(payload.state);
        if (stateRef.current.updatedAt > remoteState.updatedAt) {
          await persistRemote(stateRef.current);
          return;
        }

        stateRef.current = remoteState;
        persistLocal(remoteState);
        setState(remoteState);
        setSyncStatus("saved");
      })
      .catch(() => { if (active) setSyncStatus("error"); });

    return () => { active = false; };
  }, [persistLocal, persistRemote]);

  const commit = useCallback((update: (current: AppState) => AppState) => {
    const next = normalizeAppState({ ...update(stateRef.current), updatedAt: Date.now() });
    stateRef.current = next;
    persistLocal(next);
    setState(next);
    void persistRemote(next);
  }, [persistLocal, persistRemote]);

  const toggleAcademyModule = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      academyCompleted: current.academyCompleted.includes(id)
        ? current.academyCompleted.filter((item) => item !== id)
        : [...current.academyCompleted, id],
    }));
  }, [commit]);

  const toggleTutorial = useCallback((slug: string) => {
    commit((current) => ({
      ...current,
      tutorialsCompleted: current.tutorialsCompleted.includes(slug)
        ? current.tutorialsCompleted.filter((item) => item !== slug)
        : [...current.tutorialsCompleted, slug],
    }));
  }, [commit]);

  const setOwnedGear = useCallback((ids: string[]) => {
    commit((current) => ({ ...current, ownedGear: ids }));
  }, [commit]);

  const value = useMemo<AppStateContextValue>(() => ({
    ...state,
    ready,
    storageMode,
    syncStatus,
    localStorageError,
    toggleAcademyModule,
    toggleTutorial,
    setOwnedGear,
  }), [ready, setOwnedGear, state, storageMode, syncStatus, localStorageError, toggleAcademyModule, toggleTutorial]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState deve essere usato dentro AppStateProvider");
  return value;
}
