export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: number;
  read: boolean;
  kind: "mission" | "academy" | "coach" | "practice";
};

const storageKey = "r10-notifications-v1";
const prefsKey = "r10-notification-prefs-v1";
const lastPushKey = "r10-last-practice-push";

export type NotificationPrefs = {
  browserEnabled: boolean;
  dailyPractice: boolean;
};

export const defaultPrefs: NotificationPrefs = {
  browserEnabled: false,
  dailyPractice: true,
};

export function readPrefs(): NotificationPrefs {
  try {
    const value = JSON.parse(localStorage.getItem(prefsKey) ?? "null");
    if (!value || typeof value !== "object") return defaultPrefs;
    return {
      browserEnabled: Boolean((value as NotificationPrefs).browserEnabled),
      dailyPractice: (value as NotificationPrefs).dailyPractice !== false,
    };
  } catch {
    return defaultPrefs;
  }
}

export function writePrefs(prefs: NotificationPrefs) {
  localStorage.setItem(prefsKey, JSON.stringify(prefs));
}

export function readNotifications(): AppNotification[] {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is AppNotification => Boolean(item && typeof item === "object" && typeof item.id === "string"))
      .slice(0, 40);
  } catch {
    return [];
  }
}

export function writeNotifications(items: AppNotification[]) {
  localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 40)));
}

export function buildProgressNotifications(input: {
  academyCompleted: string[];
  tutorialsCompleted: string[];
}): AppNotification[] {
  const now = Date.now();
  const items: AppNotification[] = [];
  const missions = ["ritratto", "paesaggio", "sport", "notte"];
  const nextMission = missions.find((slug) => !input.tutorialsCompleted.includes(slug));
  if (nextMission) {
    items.push({
      id: `mission-${nextMission}`,
      title: "Missione in sospeso",
      body: `Apri la guida «${nextMission}» e completa l’esercizio pratico.`,
      href: `/tutorials/${nextMission}/`,
      createdAt: now,
      read: false,
      kind: "mission",
    });
  }

  if (!input.academyCompleted.includes("tempo")) {
    items.push({
      id: "academy-tempo",
      title: "Parti dall’Academy",
      body: "La lezione sul tempo di esposizione sblocca il percorso base della R10.",
      href: "/academy/tempo/",
      createdAt: now - 1,
      read: false,
      kind: "academy",
    });
  }

  items.push({
    id: "coach-daily",
    title: "Analizza uno scatto",
    body: "Carica una foto nel Photo Coach: l’analisi resta sul dispositivo.",
    href: "/coach/?tab=analisi",
    createdAt: now - 2,
    read: false,
    kind: "coach",
  });

  items.push({
    id: "practice-simulator",
    title: "Ripassa i comandi",
    body: "Apri il simulatore e segui «Mostrami cosa devo premere».",
    href: "/simulator/",
    createdAt: now - 3,
    read: false,
    kind: "practice",
  });

  return items;
}

export function mergeNotifications(existing: AppNotification[], generated: AppNotification[]) {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of generated) {
    const current = byId.get(item.id);
    byId.set(item.id, current ? { ...item, read: current.read, createdAt: current.createdAt } : item);
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 40);
}

export async function requestBrowserPermission() {
  if (!("Notification" in window)) return "unsupported" as const;
  if (Notification.permission === "granted") return "granted" as const;
  if (Notification.permission === "denied") return "denied" as const;
  return Notification.requestPermission();
}

export async function maybePushPracticeReminder(prefs: NotificationPrefs) {
  if (!prefs.browserEnabled || !prefs.dailyPractice) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const last = Number(localStorage.getItem(lastPushKey) ?? 0);
  if (Number.isFinite(last) && Date.now() - last < 20 * 60 * 60 * 1000) return;

  const title = "R10 Photo Coach";
  const body = "Hai 10 minuti? Completa una missione o ripassa un comando sulla R10.";
  const href = "/";

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready.catch(() => null);
    if (registration?.showNotification) {
      await registration.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        data: { href },
        tag: "r10-practice",
      });
      localStorage.setItem(lastPushKey, String(Date.now()));
      return;
    }
  }

  new Notification(title, { body, icon: "/icons/icon-192.png" });
  localStorage.setItem(lastPushKey, String(Date.now()));
}
