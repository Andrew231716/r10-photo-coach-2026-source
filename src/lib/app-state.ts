export type ThemePreference = "dark" | "light";

export type AppState = {
  academyCompleted: string[];
  tutorialsCompleted: string[];
  ownedGear: string[];
  streakDays: number;
  lastPracticeDate: string;
  theme: ThemePreference;
  onboardingDone: boolean;
  updatedAt: number;
};

const safeId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxItems = 128;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const defaultAppState: AppState = {
  academyCompleted: [],
  tutorialsCompleted: [],
  ownedGear: ["eos-r10", "rf-s-18-150", "rf-50"],
  streakDays: 0,
  lastPracticeDate: "",
  theme: "dark",
  onboardingDone: false,
  updatedAt: 0,
};

function cleanList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return [...new Set(value.filter((item): item is string => typeof item === "string" && safeId.test(item)).slice(0, maxItems))];
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function withPracticeStreak(state: AppState, when = new Date()): Pick<AppState, "streakDays" | "lastPracticeDate"> {
  const today = todayKey(when);
  if (state.lastPracticeDate === today) {
    return { streakDays: state.streakDays, lastPracticeDate: state.lastPracticeDate };
  }

  const yesterday = todayKey(new Date(when.getTime() - 24 * 60 * 60 * 1000));
  const streakDays = state.lastPracticeDate === yesterday ? Math.max(1, state.streakDays) + 1 : 1;
  return { streakDays, lastPracticeDate: today };
}

export function normalizeAppState(value: unknown, fallback: AppState = defaultAppState): AppState {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<AppState>;
  const updatedAt = typeof candidate.updatedAt === "number" && Number.isFinite(candidate.updatedAt) && candidate.updatedAt >= 0
    ? Math.floor(candidate.updatedAt)
    : fallback.updatedAt;
  const streakDays = typeof candidate.streakDays === "number" && Number.isFinite(candidate.streakDays)
    ? Math.max(0, Math.min(3650, Math.floor(candidate.streakDays)))
    : fallback.streakDays;
  const lastPracticeDate = typeof candidate.lastPracticeDate === "string" && datePattern.test(candidate.lastPracticeDate)
    ? candidate.lastPracticeDate
    : fallback.lastPracticeDate;
  const theme = candidate.theme === "light" || candidate.theme === "dark" ? candidate.theme : fallback.theme;

  return {
    academyCompleted: cleanList(candidate.academyCompleted, fallback.academyCompleted),
    tutorialsCompleted: cleanList(candidate.tutorialsCompleted, fallback.tutorialsCompleted),
    ownedGear: cleanList(candidate.ownedGear, fallback.ownedGear),
    streakDays,
    lastPracticeDate,
    theme,
    onboardingDone: typeof candidate.onboardingDone === "boolean" ? candidate.onboardingDone : fallback.onboardingDone,
    updatedAt,
  };
}
