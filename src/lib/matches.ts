import matchesFile from "@/data/matches.json";
import type { Match, MatchesFile } from "@/types";

// O JSON é validado contra o schema Zod no prebuild — aqui assumimos shape válido.
const file = matchesFile as unknown as MatchesFile;

/** Os 104 jogos em ordem cronológica (ordem do JSON é cronológica). */
export const MATCHES: Match[] = file.matches;

export function getById(id: string): Match | undefined {
  return MATCHES.find((m) => m.id === id);
}

export function brazilMatches(): Match[] {
  return MATCHES.filter((m) => m.brasil);
}

export function nextMatch(predicate: (m: Match) => boolean, nowMs: number): Match | undefined {
  return MATCHES.filter(predicate)
    .filter((m) => new Date(m.kickoffUTC).getTime() > nowMs)
    .sort(
      (a, b) =>
        new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
    )[0];
}

export function nextBrazil(nowMs: number): Match | undefined {
  return nextMatch((m) => m.brasil, nowMs);
}

export function nextAny(nowMs: number): Match | undefined {
  return nextMatch(() => true, nowMs);
}
