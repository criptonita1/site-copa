"use client";

import { useMemo } from "react";
import type { TimezoneOffset } from "@/config";
import { MATCHES, TBD_TEAM } from "@/lib/matches";
import type { MatchScore } from "@/hooks/useScores";
import type { ChannelId, Match, Stage } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import { FieldBg } from "@/components/FieldBg";
import { TABS, type TabKey } from "@/components/StageTabs";
import { useT } from "@/i18n/LangProvider";

interface MatchGridProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
  channels: Set<ChannelId>;
  onlyBrazil: boolean;
  tab: TabKey;
  /** Placares automáticos (final + ao vivo) por match.id. */
  scores?: Record<string, MatchScore>;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const NEXT_N_FALLBACK = 10;

/**
 * Filtra matches pela tab ativa. Lazy render: só os jogos da tab ativa
 * são renderizados no DOM, reduzindo de 104 cards para ~5-20 dependendo
 * da fase.
 *
 * Tab "semana":
 *  - durante a Copa: jogos das próximas 7 dias
 *  - pré-Copa: próximos 10 jogos (pra não cair em 72 da fase de grupos)
 *  - esconde jogos de mata-mata ainda sem sorteio ("A definir x A definir"),
 *    que poluiriam a janela com cards sem time. Um slot meio conhecido
 *    ("Brasil x A definir") continua aparecendo.
 */
function bothTbd(m: Match): boolean {
  return m.mandante === TBD_TEAM && m.visitante === TBD_TEAM;
}

export function filterByTab(tab: TabKey, nowMs: number): Match[] {
  if (tab === "todos") return MATCHES;
  if (tab === "semana") {
    const upcoming = MATCHES.filter((m) => {
      const t = new Date(m.kickoffUTC).getTime();
      return (
        t > nowMs - 12 * 60 * 60 * 1000 && t < nowMs + WEEK_MS && !bothTbd(m)
      );
    });
    if (upcoming.length > 0) return upcoming;
    // pré-Copa: próximos N jogos cronologicamente
    return MATCHES.filter((m) => new Date(m.kickoffUTC).getTime() > nowMs).slice(
      0,
      NEXT_N_FALLBACK,
    );
  }
  const def = TABS.find((d) => d.key === tab);
  if (!def?.stages) return MATCHES;
  return MATCHES.filter((m) => def.stages!.includes(m.stage));
}

/**
 * Aba que a grade deve abrir por padrão, conforme o momento da Copa:
 *  - enquanto houver jogo de grupos por vir → "semana" (mistura o que importa)
 *  - acabaram os grupos → primeira fase de mata-mata com jogos por vir
 * Roda só no client (num efeito) pra não causar mismatch de hidratação.
 */
const KNOCKOUT_TAB: Array<[Stage, TabKey]> = [
  ["32avos", "32avos"],
  ["oitavas", "oitavas"],
  ["quartas", "quartas"],
  ["semi", "semifinal"],
  ["terceiro", "semifinal"],
  ["final", "semifinal"],
];

export function currentPhaseTab(nowMs: number): TabKey {
  const hasUpcomingGroup = MATCHES.some(
    (m) =>
      (m.stage === "grupos" || m.stage === "abertura") &&
      new Date(m.kickoffUTC).getTime() > nowMs,
  );
  if (hasUpcomingGroup) return "semana";
  const cutoff = nowMs - 12 * 60 * 60 * 1000;
  for (const [stage, key] of KNOCKOUT_TAB) {
    if (
      MATCHES.some(
        (m) => m.stage === stage && new Date(m.kickoffUTC).getTime() > cutoff,
      )
    ) {
      return key;
    }
  }
  return "semana";
}

export function MatchGrid({
  nowMs,
  tzOffset,
  channels,
  onlyBrazil,
  tab,
  scores,
}: MatchGridProps) {
  const { t } = useT();
  // Granularidade de hora — evita refiltrar a cada segundo
  const hourKey = Math.floor(nowMs / (60 * 60 * 1000));

  const games = useMemo(() => {
    let list = filterByTab(tab, hourKey * 60 * 60 * 1000);
    if (onlyBrazil) list = list.filter((m) => m.brasil);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, hourKey, onlyBrazil]);

  return (
    <section className="games">
      <FieldBg />
      <div className="wrap">
        <div className="games-head">
          <h3>{t("grid.title")}</h3>
          <div className="lgnd">
            <span>
              <span className="sw bra" />
              {t("grid.legendBrazil")}
            </span>
            <span>
              <span className="sw free" />
              {t("grid.legendFree")}
            </span>
            <span>
              <span className="sw paid" />
              {t("grid.legendPaid")}
            </span>
          </div>
        </div>
        <div className="games-grid">
          {games.length === 0 ? (
            <div className="games-empty">
              <p>
                {onlyBrazil
                  ? t("grid.emptyBrazil")
                  : channels.size === 0
                    ? t("grid.emptyNoChannels")
                    : t("grid.emptyNoMatch")}
              </p>
            </div>
          ) : (
            games.map((m, i) => (
              <MatchCard
                key={m.id}
                match={m}
                nowMs={nowMs}
                tzOffset={tzOffset}
                userChannels={channels}
                compact={i % 4 === 3}
                score={scores?.[m.id]}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
