import matchesFile from "@/data/matches.json";
import { matchState } from "@/lib/time";
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

/**
 * O jogo "em foco" para um filtro: se há um jogo AO VIVO agora, ele é o foco
 * (tem prioridade); caso contrário, o próximo agendado. Diferente de nextMatch,
 * que ignora um jogo em andamento por já ter passado do kickoff — é justamente
 * o que faz o countdown "pular" pro próximo jogo no instante em que zera.
 */
export function currentOrNextMatch(
  predicate: (m: Match) => boolean,
  nowMs: number,
): Match | undefined {
  const pool = MATCHES.filter(predicate);
  const live = pool.find((m) => matchState(m, nowMs) === "live");
  if (live) return live;
  return pool
    .filter((m) => matchState(m, nowMs) === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
    )[0];
}

export function currentOrNextBrazil(nowMs: number): Match | undefined {
  return currentOrNextMatch((m) => m.brasil, nowMs);
}

/**
 * O "slot" em foco: todos os jogos que dividem o mesmo kickoff do próximo jogo
 * (ou do que está ao vivo). Na reta final dos grupos a FIFA joga 2 partidas no
 * mesmo horário — então o topo precisa mostrar todas, não uma só.
 */
export function currentOrNextSlot(nowMs: number): Match[] {
  const f = currentOrNextMatch(() => true, nowMs);
  if (!f) return [];
  return MATCHES.filter((m) => m.kickoffUTC === f.kickoffUTC);
}

/** Um time ainda não definido (slot de mata-mata pré-sorteio). */
export const TBD_TEAM = "A definir";

const KNOCKOUT_STAGE_SET = new Set([
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "terceiro",
  "final",
]);

/** Jogos do Brasil nas fases eliminatórias (preenchidos pelo sync do mata-mata). */
export function brazilKnockoutMatches(): Match[] {
  return brazilMatches().filter((m) => KNOCKOUT_STAGE_SET.has(m.stage));
}
