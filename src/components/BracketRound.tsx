import type { Match, Stage } from "@/types";
import { STAGE_LABEL, stageProgress } from "@/lib/bracket";
import { BracketMatch } from "@/components/BracketMatch";

interface Props {
  stage: Stage;
  matches: Match[];
  /** IDs dos jogos na trilha do Brasil pra destacar. */
  brazilPathIds?: Set<string>;
}

export function BracketRound({ stage, matches, brazilPathIds }: Props) {
  const { decided, total } = stageProgress(stage);
  const pct = total > 0 ? Math.round((decided / total) * 100) : 0;

  return (
    <section
      className="br-round"
      aria-labelledby={`round-${stage}`}
      data-stage={stage}
    >
      <header className="br-round-head">
        <h2 id={`round-${stage}`}>{STAGE_LABEL[stage]}</h2>
        {decided > 0 ? (
          <>
            <span className="br-round-count">
              {decided}/{total}
            </span>
            <span
              className="br-round-bar"
              aria-label={`${pct}% decidido`}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i style={{ width: `${pct}%` }} />
            </span>
          </>
        ) : (
          /* Fase ainda sem resultado: contagem neutra em vez de "0/N · 0%". */
          <span className="br-round-count soon">
            {total} {total === 1 ? "jogo" : "jogos"}
          </span>
        )}
      </header>

      <div className="br-round-list">
        {matches.map((m) => (
          <BracketMatch
            key={m.id}
            match={m}
            brazilPath={brazilPathIds?.has(m.id)}
          />
        ))}
      </div>
    </section>
  );
}
