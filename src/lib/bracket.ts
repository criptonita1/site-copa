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
 * NOTA sobre a tabela de progressão (qual vencedor alimenta qual jogo):
 * a FIFA define o chaveamento no sorteio dos grupos. Como ainda não temos
 * o sorteio oficial publicado em código, mapeamos por ordem cronológica:
 * cada par sequencial de matches da fase N alimenta o N-ésimo match da fase N+1.
 *
 * Quando a FIFA publicar a tabela oficial, editar o PROGRESSION abaixo.
 */

import type { Match, MatchResult, Stage } from "@/types";
import { MATCHES } from "@/lib/matches";

export const KNOCKOUT_STAGES: ReadonlyArray<Stage> = [
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "terceiro",
  "final",
];

export const STAGE_LABEL: Record<Stage, string> = {
  abertura: "Abertura",
  grupos: "Fase de Grupos",
  "32avos": "16-avos",
  oitavas: "Oitavas",
  quartas: "Quartas",
  semi: "Semifinais",
  terceiro: "3º Lugar",
  final: "Final",
};

/** Fases que aparecem como colunas do bracket (terceiro lugar fica destacado à parte). */
export const BRACKET_COLUMNS: ReadonlyArray<Stage> = [
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "final",
];

const PLACEHOLDER = "A definir";

export function isPlaceholder(team: string): boolean {
  return team === PLACEHOLDER;
}

/**
 * Vencedor do jogo. Retorna undefined se:
 *  - jogo ainda não tem resultado
 *  - jogo de grupos empatado (sem pênaltis válido pra esse contexto)
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

export function getLoser(m: Match): string | undefined {
  if (!m.resultado) return undefined;
  const winner = getWinner(m);
  if (!winner) return undefined;
  return winner === m.mandante ? m.visitante : m.mandante;
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
 * Trilha do Brasil pelo mata-mata.
 * Como ainda não sabemos onde o Brasil cai exatamente, retornamos
 * todos os jogos marcados como `brasil: true` do mata-mata, em ordem.
 * Quando os times forem preenchidos pós-grupos, esses flags devem
 * ser atualizados em matches.json.
 */
export function brazilKnockoutPath(): Match[] {
  return MATCHES.filter(
    (m) =>
      m.brasil &&
      (KNOCKOUT_STAGES as ReadonlyArray<string>).includes(m.stage),
  );
}
