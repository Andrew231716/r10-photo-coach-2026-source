"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiPath } from "@/lib/api";
import { defaultAppState, normalizeAppState, withPracticeStreak, type AppState, type ThemePreference } from "@/lib/app-state";

type StorageMode = "local" | "database";
type AppStateContextValue = AppState & {
  ready: boolean;
  storageMode: StorageMode;
  syncStatus: "checking" | "saving" | "saved" | "error" | "local";
  localStorageError: boolean;
  toggleAcademyModule: (id: string) => void;
  toggleTutorial: (slug: string) => void;
  setOwnedGear: (ids: string[]) => void;
  setTheme: (theme: ThemePreference) => void;
  completeOnboarding: () => void;
  recordPractice: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);
const storageKeys = {
  academyCompleted: "r10-academy-progress",
  tutorialsCompleted: "r10-completed-tutorials",
  ownedGear: "r10-owned-gear",
  streakDays: "r10-streak-days",
  lastPracticeDate: "r10-last-practice-date",
  theme: "r10-theme",
  onboardingDone: "r10-onboarding-done",
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
  const streakDays = Number(localStorage.getItem(storageKeys.streakDays) ?? 0);
  return normalizeAppState({
    academyCompleted: readList(storageKeys.academyCompleted, defaultAppState.academyCompleted),
    tutorialsCompleted: readList(storageKeys.tutorialsCompleted, defaultAppState.tutorialsCompleted),
    ownedGear: readList(storageKeys.ownedGear, defaultAppState.ownedGear),
    streakDays: Number.isFinite(streakDays) ? streakDays : 0,
    lastPracticeDate: localStorage.getItem(storageKeys.lastPracticeDate) ?? "",
    theme: localStorage.getItem(storageKeys.theme) === "light" ? "light" : "dark",
    onboardingDone: localStorage.getItem(storageKeys.onboardingDone) === "1",
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
  });
}

function saveLocalState(state: AppState) {
  localStorage.setItem(storageKeys.academyCompleted, JSON.stringify(state.academyCompleted));
  localStorage.setItem(storageKeys.tutorialsCompleted, JSON.stringify(state.tutorialsCompleted));
  localStorage.setItem(storageKeys.ownedGear, JSON.stringify(state.ownedGear));
  localStorage.setItem(storageKeys.streakDays, String(state.streakDays));
  localStorage.setItem(storageKeys.lastPracticeDate, state.lastPracticeDate);
  localStorage.setItem(storageKeys.theme, state.theme);
  localStorage.setItem(storageKeys.onboardingDone, state.onboardingDone ? "1" : "0");
  localStorage.setItem(storageKeys.updatedAt, String(state.updatedAt));
}

async function saveDatabaseState(state: AppState) {
  const response = await fetch(apiPath("/api/state"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
    signal: AbortSignal.timeout(15000),
  });
  return response.ok;
}

function applyTheme(theme: ThemePreference) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
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
    applyTheme(localState.theme);
    setReady(true);

    void fetch(apiPath("/api/state"), { cache: "no-store", signal: AbortSignal.timeout(15000) })
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
        // Prefer newer local edits (theme/onboarding/progress) over a stale remote snapshot.
        if (stateRef.current.updatedAt >= remoteState.updatedAt && stateRef.current.updatedAt > 0) {
          await persistRemote(stateRef.current);
          setSyncStatus("saved");
          return;
        }

        stateRef.current = remoteState;
        persistLocal(remoteState);
        applyTheme(remoteState.theme);
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
    applyTheme(next.theme);
    setState(next);
    void persistRemote(next);
  }, [persistLocal, persistRemote]);

  const toggleAcademyModule = useCallback((id: string) => {
    commit((current) => {
      const completing = !current.academyCompleted.includes(id);
      const academyCompleted = completing
        ? [...current.academyCompleted, id]
        : current.academyCompleted.filter((item) => item !== id);
      return {
        ...current,
        academyCompleted,
        ...(completing ? withPracticeStreak(current) : {}),
      };
    });
  }, [commit]);

  const toggleTutorial = useCallback((slug: string) => {
    commit((current) => {
      const completing = !current.tutorialsCompleted.includes(slug);
      const tutorialsCompleted = completing
        ? [...current.tutorialsCompleted, slug]
        : current.tutorialsCompleted.filter((item) => item !== slug);
      return {
        ...current,
        tutorialsCompleted,
        ...(completing ? withPracticeStreak(current) : {}),
      };
    });
  }, [commit]);

  const setOwnedGear = useCallback((ids: string[]) => {
    commit((current) => ({ ...current, ownedGear: ids }));
  }, [commit]);

  const setTheme = useCallback((theme: ThemePreference) => {
    commit((current) => ({ ...current, theme }));
  }, [commit]);

  const completeOnboarding = useCallback(() => {
    commit((current) => ({ ...current, onboardingDone: true }));
  }, [commit]);

  const recordPractice = useCallback(() => {
    commit((current) => ({ ...current, ...withPracticeStreak(current) }));
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
    setTheme,
    completeOnboarding,
    recordPractice,
  }), [ready, setOwnedGear, setTheme, completeOnboarding, recordPractice, state, storageMode, syncStatus, localStorageError, toggleAcademyModule, toggleTutorial]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState deve essere usato dentro AppStateProvider");
  return value;
}
