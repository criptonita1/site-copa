/**
 * Conversão de tempo. `kickoffUTC` é a fonte da verdade — toda renderização
 * passa por aqui. NUNCA fazer new Date(string com fuso BR) espalhado.
 */

import type { TimezoneOffset } from "@/config";
import type { Match, MatchState } from "@/types";
import { MONTH_ABBR, WEEKDAY_ABBR, type Lang } from "@/i18n/dict";

function asDate(iso: string): Date {
  return new Date(iso);
}

/** Retorna a "data deslocada" — não é uma data real, só pra extrair partes em UTC. */
function shifted(iso: string, offset: TimezoneOffset): Date {
  return new Date(asDate(iso).getTime() + offset * 3600 * 1000);
}

export function fmtTime(iso: string, offset: TimezoneOffset): string {
  const d = shifted(iso, offset);
  return (
    String(d.getUTCHours()).padStart(2, "0") +
    ":" +
    String(d.getUTCMinutes()).padStart(2, "0")
  );
}

export function fmtDay(
  iso: string,
  offset: TimezoneOffset,
  lang: Lang = "pt",
): string {
  const d = shifted(iso, offset);
  return (
    WEEKDAY_ABBR[lang][d.getUTCDay()] +
    " " +
    String(d.getUTCDate()).padStart(2, "0") +
    " " +
    MONTH_ABBR[lang][d.getUTCMonth()]
  );
}

export function fmtShortDay(
  iso: string,
  offset: TimezoneOffset,
  lang: Lang = "pt",
): string {
  const d = shifted(iso, offset);
  return (
    WEEKDAY_ABBR[lang][d.getUTCDay()] +
    " " +
    String(d.getUTCDate()).padStart(2, "0")
  );
}

export function dayKey(iso: string, offset: TimezoneOffset): string {
  const d = shifted(iso, offset);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function tzLabel(offset: TimezoneOffset): string {
  const map: Record<TimezoneOffset, string> = {
    [-3]: "BRT",
    [-4]: "AMT",
    [-5]: "ACT",
    [-2]: "FNT",
  };
  return map[offset];
}

/**
 * Diferença em dias de CALENDÁRIO (no fuso escolhido) entre agora e o kickoff.
 * 0 = hoje, 1 = amanhã, 2 = depois de amanhã. Diferente de countdownTo().d —
 * que conta blocos de 24h — aqui o que importa é a virada do dia, pra dizer
 * "joga HOJE" mesmo faltando 23h e "AMANHÃ" mesmo faltando 25h.
 */
export function calendarDaysUntil(
  iso: string,
  nowMs: number,
  offset: TimezoneOffset,
): number {
  const target = dayKey(iso, offset);
  const today = dayKey(new Date(nowMs).toISOString(), offset);
  const [ty, tm, td] = target.split("-").map(Number);
  const [ny, nm, nd] = today.split("-").map(Number);
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(ny, nm - 1, nd)) / 86_400_000,
  );
}

/**
 * Duração estimada de uma partida: 105 minutos para grupos, 120 para mata-mata
 * (margem pra prorrogação). Depois disso, é "ended".
 */
const MATCH_DURATION_MIN: Record<string, number> = {
  abertura: 105,
  grupos: 105,
  "32avos": 130,
  oitavas: 130,
  quartas: 130,
  semi: 130,
  terceiro: 130,
  final: 130,
};

export function matchState(match: Match, nowMs: number): MatchState {
  const kickoff = asDate(match.kickoffUTC).getTime();
  const durationMs = (MATCH_DURATION_MIN[match.stage] ?? 105) * 60 * 1000;
  if (nowMs < kickoff) return "upcoming";
  if (nowMs < kickoff + durationMs) return "live";
  return "ended";
}

/** Minuto aproximado da partida quando ao vivo (1..120+). */
export function liveMinute(match: Match, nowMs: number): number {
  const kickoff = asDate(match.kickoffUTC).getTime();
  return Math.max(1, Math.floor((nowMs - kickoff) / 60000) + 1);
}

export interface Countdown {
  d: number;
  h: number;
  m: number;
  s: number;
  totalMs: number;
}

export function countdownTo(iso: string, nowMs: number): Countdown {
  let diff = Math.max(0, asDate(iso).getTime() - nowMs);
  const totalMs = diff;
  const d = Math.floor(diff / 86_400_000);
  diff -= d * 86_400_000;
  const h = Math.floor(diff / 3_600_000);
  diff -= h * 3_600_000;
  const m = Math.floor(diff / 60_000);
  diff -= m * 60_000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s, totalMs };
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
