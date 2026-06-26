"use client";

import { useMemo, useState } from "react";
import {
  BRACKET_COLUMNS,
  brazilKnockoutPath,
  getBracket,
  getChampion,
  matchesByStage,
  overallProgress,
} from "@/lib/bracket";
import { BracketRound } from "@/components/BracketRound";
import { BracketMatch } from "@/components/BracketMatch";

/** DD/MM no fuso de Brasília (-3) — o bracket não tem seletor de fuso. */
function ddmmBR(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 3 * 3600 * 1000);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export function Bracket() {
  const [followBrazil, setFollowBrazil] = useState(false);

  const { bracket, third, champion, brazilIds, progress, hasBrazilPath, koStart } =
    useMemo(() => {
      const b = getBracket();
      const path = brazilKnockoutPath();
      return {
        bracket: b,
        third: matchesByStage("terceiro")[0],
        champion: getChampion(),
        brazilIds: new Set(path.map((m) => m.id)),
        progress: overallProgress(),
        hasBrazilPath: path.length > 0,
        koStart: matchesByStage("32avos")[0],
      };
    }, []);

  // Antes do 1º jogo do mata-mata, "0/32 · 0%" parece morto — então mostramos
  // quando o mata-mata começa. A barra só aparece quando há jogo decidido.
  const started = progress.decided > 0;

  return (
    <div className="bracket-wrap">
      {/* Banner Campeão (só aparece quando final decidida) */}
      {champion && (
        <div className="br-champion" role="status">
          <span className="br-champion-lab">★ Campeão · 2026</span>
          <span className="br-champion-name">{champion}</span>
        </div>
      )}

      {/* Progress overall */}
      <div className="br-overall">
        <div className="br-overall-row">
          <span className="br-overall-lab">CAMINHADA</span>
          {started ? (
            <>
              <span className="br-overall-bar" aria-hidden="true">
                <i style={{ width: `${progress.pct}%` }} />
              </span>
              <span className="br-overall-pct">
                {progress.decided}/{progress.total} · {progress.pct}%
              </span>
            </>
          ) : (
            <span className="br-overall-soon">
              {koStart
                ? `Mata-mata começa ${ddmmBR(koStart.kickoffUTC)}`
                : "Em breve"}
            </span>
          )}
        </div>
        {hasBrazilPath && (
          <button
            className={`br-follow-br ${followBrazil ? "on" : ""}`}
            aria-pressed={followBrazil}
            onClick={() => setFollowBrazil((v) => !v)}
          >
            🇧🇷 {followBrazil ? "Desmarcar Brasil" : "Seguir o Brasil"}
          </button>
        )}
      </div>

      {/* Hint mobile */}
      <p className="br-hint">
        Arrasta lateralmente entre as fases. Toca num card pra ver detalhes.
      </p>

      {/* Snap-scroll horizontal das fases */}
      <div className="br-track" role="region" aria-label="Chaveamento">
        {BRACKET_COLUMNS.map((stage) => (
          <BracketRound
            key={stage}
            stage={stage}
            matches={bracket[stage]}
            brazilPathIds={followBrazil ? brazilIds : undefined}
          />
        ))}
      </div>

      {/* 3º Lugar — destacado fora do bracket principal */}
      {third && (
        <section className="br-third">
          <h2>3º Lugar</h2>
          <div className="br-third-card">
            <BracketMatch match={third} />
          </div>
          <p className="br-third-note">
            Disputado pelos perdedores das semifinais, antes da grande final.
          </p>
        </section>
      )}
    </div>
  );
}
