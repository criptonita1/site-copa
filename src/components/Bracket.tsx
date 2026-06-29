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
import { useT } from "@/i18n/LangProvider";
import { teamName } from "@/i18n/dict";

/** DD/MM no fuso de Brasília (-3) — o bracket não tem seletor de fuso. */
function ddmmBR(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 3 * 3600 * 1000);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export function Bracket() {
  const { t, lang } = useT();
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

  const started = progress.decided > 0;

  return (
    <div className="bracket-wrap">
      {/* Banner Campeão (só aparece quando final decidida) */}
      {champion && (
        <div className="br-champion" role="status">
          <span className="br-champion-lab">{t("bracket.champion")}</span>
          <span className="br-champion-name">{teamName(champion, lang)}</span>
        </div>
      )}

      {/* Progress overall */}
      <div className="br-overall">
        <div className="br-overall-row">
          <span className="br-overall-lab">{t("bracket.caminhada")}</span>
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
                ? t("bracket.koStart", { date: ddmmBR(koStart.kickoffUTC) })
                : "—"}
            </span>
          )}
        </div>
        {hasBrazilPath && (
          <button
            className={`br-follow-br ${followBrazil ? "on" : ""}`}
            aria-pressed={followBrazil}
            onClick={() => setFollowBrazil((v) => !v)}
          >
            🇧🇷 {followBrazil ? t("bracket.unfollowBr") : t("bracket.followBr")}
          </button>
        )}
      </div>

      {/* Hint mobile */}
      <p className="br-hint">{t("bracket.hint")}</p>

      {/* Snap-scroll horizontal das fases */}
      <div className="br-track" role="region" aria-label={t("bracket.title")}>
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
          <h2>{t("bracket.stage.terceiro")}</h2>
          <div className="br-third-card">
            <BracketMatch match={third} />
          </div>
          <p className="br-third-note">{t("bracket.thirdNote")}</p>
        </section>
      )}
    </div>
  );
}
