/**
 * Bracket — derivação do chaveamento a partir do matches.json.
 *
 * Estrutura da Copa 2026 mata-mata (32 seleções classificadas):
 *  - 32-avos:  16 jogos (M073..M088)
 *  - oitavas:   8 jogos (M089..M096)
 *  - quartas:   4 jogos (M097..M100)
 *  - semis:     2 jogos (M101..M102)
 *  - terceiro:  1 jogo  (M103)
 *  - final:     1 jogo  (M104)
 *
 * A chave se completa sozinha conforme os times entram no JSON e os resultados
 * (`resultado`) vão sendo preenchidos. Enquanto o sorteio não sai, os slots
 * ficam "A definir x A definir" — o bracket renderiza os cards vazios, prontos.
 */

import type { Match, MatchResult, Stage } from "@/types";
import { MATCHES, TBD_TEAM } from "@/lib/matches";

export const KNOCKOUT_STAGES: ReadonlyArray<Stage> = [
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "terceiro",
  "final",
];

/** Rótulos alinhados com a terminologia do resto do site (i18n stage.*). */
export const STAGE_LABEL: Record<Stage, string> = {
  abertura: "Abertura",
  grupos: "Fase de Grupos",
  "32avos": "32-avos",
  oitavas: "Oitavas",
  quartas: "Quartas",
  semi: "Semifinais",
  terceiro: "3º Lugar",
  final: "Final",
};

/** Fases que aparecem como colunas do bracket (3º lugar fica destacado à parte). */
export const BRACKET_COLUMNS: ReadonlyArray<Stage> = [
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "final",
];

export function isPlaceholder(team: string): boolean {
  return team === TBD_TEAM;
}

/**
 * Vencedor do jogo. Retorna undefined se:
 *  - jogo ainda não tem resultado
 *  - empate sem pênaltis (não decidido)
 */
export function getWinner(m: Match): string | undefined {
  if (!m.resultado) return undefined;
  const r = m.resultado;
  if (r.golsMandante > r.golsVisitante) return m.mandante;
  if (r.golsVisitante > r.golsMandante) return m.visitante;
  // empate — só decide se tem pênaltis (mata-mata)
  if (r.penaltis) {
    if (r.penaltis.mandante > r.penaltis.visitante) return m.mandante;
    if (r.penaltis.visitante > r.penaltis.mandante) return m.visitante;
  }
  return undefined;
}

/**
 * Formata o placar pra exibir no card.
 * Ex: "2 × 1", ou "1 × 1 (4-3 pen.)", ou "" se não tem resultado.
 */
export function formatScore(r: MatchResult | undefined): string {
  if (!r) return "";
  const base = `${r.golsMandante} × ${r.golsVisitante}`;
  if (r.penaltis) {
    return `${base} (${r.penaltis.mandante}-${r.penaltis.visitante} pen.)`;
  }
  return base;
}

/** Todos os jogos de uma fase (em ordem cronológica). */
export function matchesByStage(stage: Stage): Match[] {
  return MATCHES.filter((m) => m.stage === stage);
}

/** Bracket completo agrupado por fase. */
export function getBracket(): Record<Stage, Match[]> {
  const result = {} as Record<Stage, Match[]>;
  for (const s of KNOCKOUT_STAGES) {
    result[s] = matchesByStage(s);
  }
  return result;
}

/** Progresso por fase: jogos decididos / total. */
export function stageProgress(stage: Stage): { decided: number; total: number } {
  const games = matchesByStage(stage);
  return {
    decided: games.filter((m) => getWinner(m) !== undefined).length,
    total: games.length,
  };
}

/** Progresso global do mata-mata (incl. 3º lugar e final). */
export function overallProgress(): { decided: number; total: number; pct: number } {
  let decided = 0;
  let total = 0;
  for (const s of KNOCKOUT_STAGES) {
    const p = stageProgress(s);
    decided += p.decided;
    total += p.total;
  }
  return {
    decided,
    total,
    pct: total > 0 ? Math.round((decided / total) * 100) : 0,
  };
}

/** Campeão (vencedor da final), undefined se não decidida. */
export function getChampion(): string | undefined {
  const finals = matchesByStage("final");
  if (finals.length === 0) return undefined;
  return getWinner(finals[0]);
}

/**
 * Trilha do Brasil pelo mata-mata: todos os jogos `brasil: true` das fases
 * eliminatórias, em ordem. Vazio enquanto o Brasil não for marcado nos slots
 * pós-grupos em matches.json.
 */
export function brazilKnockoutPath(): Match[] {
  return MATCHES.filter(
    (m) =>
      m.brasil &&
      (KNOCKOUT_STAGES as ReadonlyArray<string>).includes(m.stage),
  );
}
