"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultAppState, normalizeAppState, type AppState } from "@/lib/app-state";

type StorageMode = "local" | "database";
type AppStateContextValue = AppState & {
  ready: boolean;
  storageMode: StorageMode;
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
  });
  return response.ok;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);
  const [ready, setReady] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("local");
  const stateRef = useRef(state);

  useEffect(() => {
    let active = true;
    const localState = readLocalState();
    stateRef.current = localState;
    setState(localState);
    setReady(true);

    void fetch("/api/state", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ mode?: string; found?: boolean; state?: unknown }>;
      })
      .then(async (payload) => {
        if (!active || payload?.mode !== "database") return;
        setStorageMode("database");

        if (!payload.found) {
          await saveDatabaseState(stateRef.current);
          return;
        }

        const remoteState = normalizeAppState(payload.state);
        if (stateRef.current.updatedAt > remoteState.updatedAt) {
          await saveDatabaseState(stateRef.current);
          return;
        }

        stateRef.current = remoteState;
        saveLocalState(remoteState);
        setState(remoteState);
      })
      .catch(() => undefined);

    return () => { active = false; };
  }, []);

  const commit = useCallback((update: (current: AppState) => AppState) => {
    const next = normalizeAppState({ ...update(stateRef.current), updatedAt: Date.now() });
    stateRef.current = next;
    saveLocalState(next);
    setState(next);
    void saveDatabaseState(next)
      .then((saved) => { if (saved) setStorageMode("database"); })
      .catch(() => undefined);
  }, []);

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
    toggleAcademyModule,
    toggleTutorial,
    setOwnedGear,
  }), [ready, setOwnedGear, state, storageMode, toggleAcademyModule, toggleTutorial]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState deve essere usato dentro AppStateProvider");
  return value;
}
