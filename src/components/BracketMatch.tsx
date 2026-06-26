import type { Match } from "@/types";
import { formatScore, getWinner, isPlaceholder } from "@/lib/bracket";
import { TBD_TEAM } from "@/lib/matches";

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

export function BracketMatch({ match, brazilPath, highlight }: Props) {
  const winner = getWinner(match);
  const decided = winner !== undefined;
  const isBR = match.brasil;

  const classes = [
    "bm",
    decided ? "decided" : "pending",
    isBR ? "br" : "",
    brazilPath ? "br-path" : "",
    highlight ? "hl" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classes}
      aria-label={`${match.mandante} contra ${match.visitante}${
        decided ? `, vencedor ${winner}` : ", aguardando"
      }`}
    >
      <header className="bm-head">
        <span className="bm-id">{match.id}</span>
        <span className="bm-when">{ddmm(match.kickoffUTC)}</span>
      </header>

      <div className="bm-teams">
        <TeamRow
          name={match.mandante}
          score={match.resultado?.golsMandante}
          isWinner={decided && winner === match.mandante}
          loserDimmed={decided && winner !== match.mandante}
        />
        <div className="bm-vs" aria-hidden="true">
          {decided ? formatScoreCompact(match) : "vs"}
        </div>
        <TeamRow
          name={match.visitante}
          score={match.resultado?.golsVisitante}
          isWinner={decided && winner === match.visitante}
          loserDimmed={decided && winner !== match.visitante}
        />
      </div>

      <footer className="bm-foot">
        <span className="bm-stadium">{match.estadio}</span>
      </footer>
    </article>
  );
}

function formatScoreCompact(m: Match) {
  if (!m.resultado) return "vs";
  if (m.resultado.penaltis) {
    return `${m.resultado.penaltis.mandante}-${m.resultado.penaltis.visitante} pen`;
  }
  return formatScore(m.resultado);
}

function TeamRow({
  name,
  score,
  isWinner,
  loserDimmed,
}: {
  name: string;
  score?: number;
  isWinner: boolean;
  loserDimmed: boolean;
}) {
  const cls = ["bm-team", isWinner ? "win" : "", loserDimmed ? "lose" : ""]
    .filter(Boolean)
    .join(" ");
  const display = isPlaceholder(name) ? TBD_TEAM : name;
  return (
    <div className={cls}>
      <span className="bm-name">{display}</span>
      {score !== undefined && <span className="bm-score">{score}</span>}
    </div>
  );
}
