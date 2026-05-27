/**
 * localStorage SSR-safe. Tolera Safari privado (try/catch).
 */

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function lsSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  channels: "ovc:channels",
  onlyBrazil: "ovc:onlyBrazil",
  tzOffset: "ovc:tzOffset",
} as const;
