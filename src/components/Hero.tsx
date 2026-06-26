"use client";

import { useMemo } from "react";
import type { Match } from "@/types";
import { BRAZIL, type TimezoneOffset } from "@/config";
import { brazilKnockoutMatches, currentOrNextSlot } from "@/lib/matches";
import { Jersey } from "@/lib/jersey";
import {
  calendarDaysUntil,
  countdownTo,
  fmtDay,
  fmtTime,
  matchState,
  pad2,
  tzLabel,
} from "@/lib/time";
import { ArrowDownSvg } from "@/components/icons";
import { GoalNet } from "@/components/GoalNet";
import { ChannelBadge } from "@/components/ChannelBadge";
import type { MatchScore } from "@/hooks/useScores";
import { useT } from "@/i18n/LangProvider";
import { teamName, cityName, type Lang } from "@/i18n/dict";

interface HeroProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
  scores?: Record<string, MatchScore>;
}

/** Countdown compacto em texto: "2d 4h", "4h 12min" ou "12min 30s". */
function compactCountdown(kickoffUTC: string, nowMs: number): string {
  const c = countdownTo(kickoffUTC, nowMs);
  if (c.d > 0) return `${c.d}d ${c.h}h`;
  if (c.h > 0) return `${c.h}h ${pad2(c.m)}min`;
  return `${c.m}min ${pad2(c.s)}s`;
}

/** Card de um jogo no topo: times, placar (se ao vivo), local e onde ver. */
function HeroMatchCard({
  match,
  live,
  score,
  tzOffset,
  lang,
}: {
  match: Match;
  live: boolean;
  score?: MatchScore;
  tzOffset: TimezoneOffset;
  lang: Lang;
}) {
  const { t } = useT();
  return (
    <aside className={live ? "hero-match is-live" : "hero-match"}>
      {live && (
        <span className="hero-match-live" aria-label={t("hero.liveAria")}>
          <span className="dot" aria-hidden="true" />
          {t("hero.live")}
        </span>
      )}
      <div className="vs-row">
        <div className="jersey-wrap">
          <span className="jersey">
            <Jersey team={match.mandante} size={54} />
          </span>
          <span className="country">
            {teamName(match.mandante, lang).toUpperCase()}
          </span>
        </div>
        {score ? (
          <span className="hero-score">
            {score.golsMandante}
            <i>×</i>
            {score.golsVisitante}
          </span>
        ) : (
          <span className="x">×</span>
        )}
        <div className="jersey-wrap right">
          <span className="jersey">
            <Jersey team={match.visitante} size={54} />
          </span>
          <span className="country">
            {teamName(match.visitante, lang).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="meta-line">
        {match.grupo ? `${t("hero.group", { g: match.grupo })} · ` : ""}
        {t(`stage.${match.stage}`)} · {fmtTime(match.kickoffUTC, tzOffset)}{" "}
        {tzLabel(tzOffset)}
      </div>
      <div className="stadium">{match.estadio.toUpperCase()}</div>
      <div className="when">{cityName(match.cidade, lang)}</div>
      <div className="hero-card-channels">
        <span className="lbl">{t("hero.watchOn")}</span>
        <div className="chips">
          {match.canais.map((c) => (
            <ChannelBadge key={c} id={c} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export function Hero({ nowMs, tzOffset, scores }: HeroProps) {
  const { t, lang } = useT();
  // nowMs===0 = ainda não hidratado (SSR e 1º render do client).
  const hydrated = nowMs > 0;

  // Foco estável em escala de minutos — só muda quando um jogo começa/acaba.
  const minuteMs = Math.floor(nowMs / 60_000) * 60_000;

  const { slot, live } = useMemo(() => {
    const s = currentOrNextSlot(minuteMs);
    const f = s[0];
    return {
      slot: s,
      live: hydrated && f ? matchState(f, minuteMs) === "live" : false,
    };
  }, [minuteMs, hydrated]);

  const focus = slot[0];

  // Selo "Brasil classificado" — assertivo via config (o site não tem tabela).
  const brQualified = BRAZIL.classificado;
  const brNextKO = useMemo(() => {
    if (!brQualified || !hydrated) return undefined;
    return brazilKnockoutMatches()
      .filter((m) => new Date(m.kickoffUTC).getTime() > minuteMs)
      .sort(
        (a, b) =>
          new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
      )[0];
  }, [brQualified, hydrated, minuteMs]);

  const calDays =
    focus && hydrated
      ? calendarDaysUntil(focus.kickoffUTC, minuteMs, tzOffset)
      : null;

  const kicker = live
    ? t("hero.liveTag")
    : slot.length > 1
      ? t("hero.nextGames")
      : t("hero.nextTag");

  // "HOJE · 16:00 BRT" / "AMANHÃ · …" / "QUI 26 JUN · …"
  const whenLabel = focus
    ? `${
        calDays === 0
          ? t("hero.today")
          : calDays === 1
            ? t("hero.tomorrow")
            : fmtDay(focus.kickoffUTC, tzOffset, lang).toUpperCase()
      } · ${fmtTime(focus.kickoffUTC, tzOffset)} ${tzLabel(tzOffset)}`
    : "";

  return (
    <section className="hero">
      <GoalNet />

      <svg className="hero-flag-big" viewBox="0 0 280 200" aria-hidden="true">
        <rect x="6" y="4" width="6" height="196" fill="#0d0d0d" />
        <circle cx="9" cy="4" r="7" fill="#0d0d0d" />
        <path
          d="M12 16 Q 70 4, 150 20 Q 220 32, 270 14 L 270 116 Q 220 132, 150 118 Q 70 104, 12 122 Z"
          fill="#00A045"
          stroke="#0d0d0d"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="140,30 232,68 140,106 48,68"
          fill="#FFDB2A"
          stroke="#0d0d0d"
          strokeWidth="2"
        />
        <ellipse cx="140" cy="68" rx="30" ry="27" fill="#1D3FA1" stroke="#0d0d0d" strokeWidth="2" />
        <path d="M115 74 Q 140 62, 165 76" stroke="#fff" strokeWidth="3" fill="none" />
      </svg>

      <div className="wrap">
        <div className="hero-tagrow">
          <div className="left">
            <span className="stamp">{t("hero.special")}</span>
            <span>{t("hero.worldcup")}</span>
          </div>
          <div className="right">
            <span className="ed">{t("hero.fanEdition")}</span>
          </div>
        </div>

        {!focus ? (
          /* FIM DE LINHA — nenhum jogo ao vivo nem agendado: a Copa acabou */
          <div className="hero-over">
            <h1 className="hero-row1" style={{ margin: 0 }}>
              {t("hero.over1")} <span className="joga">{t("hero.over2")}</span>{" "}
              <span className="em-num word">2026</span>
            </h1>
            <p className="hero-sub">{t("hero.overSub")}</p>
            <a href="#grade" className="hero-cta">
              {t("hero.cta")}
              <ArrowDownSvg />
            </a>
          </div>
        ) : (
          <div className="hero-next">
            <div className="hero-next-head">
              <span className={live ? "hero-next-kicker live" : "hero-next-kicker"}>
                {kicker}
              </span>
              {!live && (
                <>
                  <span className="hero-next-when">{whenLabel}</span>
                  {hydrated && (
                    <span className="hero-next-cd">
                      {t("hero.startsIn", {
                        x: compactCountdown(focus.kickoffUTC, nowMs),
                      })}
                    </span>
                  )}
                </>
              )}
            </div>

            {brQualified && (
              <div className="hero-br-status" role="status">
                <span className="flag" aria-hidden="true">
                  🇧🇷
                </span>
                <span className="txt">
                  {t("hero.brQualified")}
                  {brNextKO
                    ? ` · ${t("hero.brPlaysOn", {
                        date: fmtDay(brNextKO.kickoffUTC, tzOffset, lang),
                      })}`
                    : ""}
                </span>
              </div>
            )}

            <div className="hero-next-cards">
              {slot.map((m) => (
                <HeroMatchCard
                  key={m.id}
                  match={m}
                  live={live}
                  score={scores?.[m.id]}
                  tzOffset={tzOffset}
                  lang={lang}
                />
              ))}
            </div>

            <a href="#grade" className="hero-cta">
              {t("hero.cta")}
              <ArrowDownSvg />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
