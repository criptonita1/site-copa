"use client";

import { useMemo } from "react";
import type { TimezoneOffset } from "@/config";
import { MATCHES } from "@/lib/matches";
import type { ChannelId, Match } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import { FieldBg } from "@/components/FieldBg";
import { TABS, type TabKey } from "@/components/StageTabs";

interface MatchGridProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
  channels: Set<ChannelId>;
  onlyBrazil: boolean;
  tab: TabKey;
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
 */
export function filterByTab(tab: TabKey, nowMs: number): Match[] {
  if (tab === "todos") return MATCHES;
  if (tab === "semana") {
    const upcoming = MATCHES.filter((m) => {
      const t = new Date(m.kickoffUTC).getTime();
      return t > nowMs - 12 * 60 * 60 * 1000 && t < nowMs + WEEK_MS;
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

export function MatchGrid({
  nowMs,
  tzOffset,
  channels,
  onlyBrazil,
  tab,
}: MatchGridProps) {
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
          <h3>O ÁLBUM DA COPA</h3>
          <div className="lgnd">
            <span>
              <span className="sw bra" />
              BRASIL
            </span>
            <span>
              <span className="sw free" />
              GRÁTIS
            </span>
            <span>
              <span className="sw paid" />
              PAGO
            </span>
          </div>
        </div>
        <div className="games-grid">
          {games.length === 0 ? (
            <div className="games-empty">
              <p>
                {onlyBrazil
                  ? "Brasil não joga nessa fase ainda — confere as outras abas ou desativa o filtro 'só Brasil'."
                  : channels.size === 0
                    ? "Marque pelo menos um canal acima pra ver onde passa cada jogo."
                    : "Nenhum jogo nessa fase passa nos canais que você tem. Tente outra aba ou ative mais canais."}
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
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
