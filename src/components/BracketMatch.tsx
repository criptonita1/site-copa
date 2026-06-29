"use client";

import type { Match } from "@/types";
import { getWinner, isPlaceholder } from "@/lib/bracket";
import { Jersey } from "@/lib/jersey";
import { TEAMS, TEAM_TBD } from "@/data/teams";
import { useT } from "@/i18n/LangProvider";
import { teamName, type Lang } from "@/i18n/dict";

interface Props {
  match: Match;
  /** Destaca o card como "trilha do Brasil". */
  brazilPath?: boolean;
  /** Destaca como vencedor da fase anterior (uso futuro). */
  highlight?: boolean;
}

/** Data abreviada DD/MM no fuso de Brasília (-3), sem depender de horarioBrasilia. */
function ddmm(kickoffUTC: string): string {
  const d = new Date(new Date(kickoffUTC).getTime() - 3 * 3600 * 1000);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

/** Cor identitária da seleção (camisa). Branca usa o accent; slot vazio = neutro. */
function teamColor(team: string): string {
  const j = TEAMS[team];
  if (!j) return TEAM_TBD.accent;
  const body = j.body.toLowerCase();
  return body === "#fff" || body === "#ffffff" ? j.accent : j.body;
}

/** Nome pra exibir: traduz seleções e também os rótulos de slot ("3º colocado"). */
function displayTeam(team: string, lang: Lang): string {
  const named = teamName(team, lang);
  if (named !== team) return named; // estava no mapa de nomes (seleção ou "A definir")
  if (lang !== "en") return team; // rótulos de slot já estão em PT
  const g = team.match(/^([12])º do Grupo ([A-L])$/);
  if (g) return `${g[1] === "1" ? "1st" : "2nd"} of Group ${g[2]}`;
  if (team === "3º colocado") return "3rd place";
  return team;
}

export function BracketMatch({ match, brazilPath, highlight }: Props) {
  const { t, lang } = useT();
  const winner = getWinner(match);
  const decided = winner !== undefined;
  const isBR = match.brasil;
  const pens = match.resultado?.penaltis;

  const classes = [
    "bm",
    decided ? "decided" : "pending",
    isBR ? "br" : "",
    brazilPath ? "br-path" : "",
    highlight ? "hl" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const aria = decided
    ? t("bracket.winnerAria", {
        home: displayTeam(match.mandante, lang),
        away: displayTeam(match.visitante, lang),
        winner: displayTeam(winner, lang),
      })
    : t("bracket.pendingAria", {
        home: displayTeam(match.mandante, lang),
        away: displayTeam(match.visitante, lang),
      });

  return (
    <article className={classes} aria-label={aria}>
      <header className="bm-head">
        <span className="bm-id">{match.id}</span>
        <span className="bm-when">{ddmm(match.kickoffUTC)}</span>
      </header>

      <div className="bm-teams">
        <TeamRow
          team={match.mandante}
          score={decided ? match.resultado?.golsMandante : undefined}
          isWinner={decided && winner === match.mandante}
          loserDimmed={decided && winner !== match.mandante}
          lang={lang}
        />
        <div className="bm-vs" aria-hidden="true">
          {decided ? "×" : t("bracket.vs")}
        </div>
        <TeamRow
          team={match.visitante}
          score={decided ? match.resultado?.golsVisitante : undefined}
          isWinner={decided && winner === match.visitante}
          loserDimmed={decided && winner !== match.visitante}
          lang={lang}
        />
      </div>

      <footer className="bm-foot">
        <span className="bm-stadium">{match.estadio}</span>
        {pens && (
          <span className="bm-pens">
            {pens.mandante}-{pens.visitante} pên
          </span>
        )}
      </footer>
    </article>
  );
}

function TeamRow({
  team,
  score,
  isWinner,
  loserDimmed,
  lang,
}: {
  team: string;
  score?: number;
  isWinner: boolean;
  loserDimmed: boolean;
  lang: Lang;
}) {
  const cls = ["bm-team", isWinner ? "win" : "", loserDimmed ? "lose" : ""]
    .filter(Boolean)
    .join(" ");
  const tbd = isPlaceholder(team) || !TEAMS[team];
  return (
    <div className={cls} style={{ borderLeftColor: teamColor(team) }}>
      <span className={tbd ? "bm-jersey tbd" : "bm-jersey"}>
        <Jersey team={team} size={22} />
      </span>
      <span className="bm-name">{displayTeam(team, lang)}</span>
      {score !== undefined && <span className="bm-score">{score}</span>}
    </div>
  );
}
