export type AppState = {
  academyCompleted: string[];
  tutorialsCompleted: string[];
  ownedGear: string[];
  updatedAt: number;
};

const safeId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxItems = 128;

export const defaultAppState: AppState = {
  academyCompleted: [],
  tutorialsCompleted: [],
  ownedGear: ["eos-r10", "rf-s-18-150", "rf-50"],
  updatedAt: 0,
};

function cleanList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return [...new Set(value.filter((item): item is string => typeof item === "string" && safeId.test(item)).slice(0, maxItems))];
}

export function normalizeAppState(value: unknown, fallback: AppState = defaultAppState): AppState {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<AppState>;
  const updatedAt = typeof candidate.updatedAt === "number" && Number.isFinite(candidate.updatedAt) && candidate.updatedAt >= 0
    ? Math.floor(candidate.updatedAt)
    : fallback.updatedAt;

  return {
    academyCompleted: cleanList(candidate.academyCompleted, fallback.academyCompleted),
    tutorialsCompleted: cleanList(candidate.tutorialsCompleted, fallback.tutorialsCompleted),
    ownedGear: cleanList(candidate.ownedGear, fallback.ownedGear),
    updatedAt,
  };
}
