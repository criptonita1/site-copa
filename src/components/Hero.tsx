"use client";

import { useMemo } from "react";
import type { TimezoneOffset } from "@/config";
import { currentOrNextBrazil, currentOrNextMatch } from "@/lib/matches";
import { Jersey } from "@/lib/jersey";
import {
  calendarDaysUntil,
  fmtDay,
  fmtTime,
  matchState,
  pad2,
  tzLabel,
} from "@/lib/time";
import { ArrowDownSvg } from "@/components/icons";
import { GoalNet } from "@/components/GoalNet";
import { Countdown } from "@/components/Countdown";
import { ChannelBadge } from "@/components/ChannelBadge";
import type { MatchScore } from "@/hooks/useScores";
import { useT } from "@/i18n/LangProvider";
import { teamName, cityName } from "@/i18n/dict";

interface HeroProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
  scores?: Record<string, MatchScore>;
}

const COUNTDOWN_CELLS: Array<{ key: string; lab: string }> = [
  { key: "d", lab: "cd.days" },
  { key: "h", lab: "cd.hours" },
  { key: "m", lab: "cd.min" },
  { key: "s", lab: "cd.sec" },
];

/** Placeholder estável pré-hidratação (nowMs===0) — evita piscar número gigante. */
function CountdownPlaceholder() {
  const { t } = useT();
  return (
    <div className="cd" aria-hidden="true">
      {COUNTDOWN_CELLS.map((c, i) => (
        <div className={i === 3 ? "cell s" : "cell"} key={c.key}>
          <div className="num">00</div>
          <div className="lab">{t(c.lab)}</div>
        </div>
      ))}
    </div>
  );
}

export function Hero({ nowMs, tzOffset, scores }: HeroProps) {
  const { t, lang } = useT();
  // nowMs===0 = ainda não hidratado (SSR e 1º render do client). Tratamos como
  // "carregando" pra não renderizar estado AO VIVO nem contagem com base em 1970.
  const hydrated = nowMs > 0;

  // O foco é estável em escala de minutos — só muda quando um jogo começa/acaba.
  const minuteKey = Math.floor(nowMs / 60_000);
  const minuteMs = minuteKey * 60_000;

  const { focus, isBrazil, live } = useMemo(() => {
    // Brasil tem prioridade; sem jogo do Brasil (eliminado/campeão/mata-mata
    // com adversário indefinido), cai pro próximo jogo qualquer da Copa.
    const br = currentOrNextBrazil(minuteMs);
    const f = br ?? currentOrNextMatch(() => true, minuteMs);
    return {
      focus: f,
      isBrazil: !!br,
      live: hydrated && f ? matchState(f, minuteMs) === "live" : false,
    };
  }, [minuteMs, hydrated]);

  const subject = isBrazil ? t("hero.subject.brazil") : t("hero.subject.cup");
  const focusScore = focus ? scores?.[focus.id] : undefined;
  const calDays =
    focus && hydrated
      ? calendarDaysUntil(focus.kickoffUTC, minuteMs, tzOffset)
      : null;
  const opponent =
    focus && isBrazil
      ? focus.mandante === "Brasil"
        ? focus.visitante
        : focus.mandante
      : null;

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

        <div className="hero-cover">
          <div className="hero-headline">
            {!focus ? (
              /* FIM DE LINHA — nenhum jogo ao vivo nem agendado: a Copa acabou */
              <>
                <h1 className="hero-row1" style={{ margin: 0 }}>
                  {t("hero.over1")} <span className="joga">{t("hero.over2")}</span>
                </h1>
                <div className="hero-row2">
                  <span className="em-num word">2026</span>
                </div>
                <p className="hero-sub">
                  {t("hero.overSub")}
                </p>
              </>
            ) : live ? (
              /* AO VIVO — o jogo está rolando AGORA: mostra onde assistir na hora */
              <>
                <h1 className="hero-row1" style={{ margin: 0 }}>
                  {subject} <span className="joga">{t("hero.plays")}</span>
                </h1>
                <div className="hero-row2 is-live">
                  <span className="agora">{t("hero.now")}</span>
                  <span className="livebadge" aria-label={t("hero.liveAria")}>
                    <span className="dot" aria-hidden="true" />
                    {t("hero.live")}
                  </span>
                </div>
                <div className="hero-live-channels">
                  <span className="lbl">{t("hero.watchNowOn")}</span>
                  <div className="chips">
                    {focus.canais.map((c) => (
                      <ChannelBadge key={c} id={c} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* FALTANDO — contagem regressiva pro próximo jogo */
              <>
                <h1 className="hero-row1" style={{ margin: 0 }}>
                  {subject} <span className="joga">{t("hero.plays")}</span>
                </h1>

                {calDays === 0 ? (
                  <>
                    <div className="hero-row2">
                      <span className="em-num word">{t("hero.today")}</span>
                    </div>
                    <p className="hero-sub">
                      {t("hero.atTime", {
                        time: fmtTime(focus.kickoffUTC, tzOffset),
                        tz: tzLabel(tzOffset),
                      })}
                      {opponent
                        ? ` · ${t("hero.vs", { team: teamName(opponent, lang) })}`
                        : ""}
                    </p>
                  </>
                ) : calDays === 1 ? (
                  <>
                    <div className="hero-row2">
                      <span className="em-num word">{t("hero.tomorrow")}</span>
                    </div>
                    <p className="hero-sub">
                      {t("hero.atTime", {
                        time: fmtTime(focus.kickoffUTC, tzOffset),
                        tz: tzLabel(tzOffset),
                      })}
                      {opponent
                        ? ` · ${t("hero.vs", { team: teamName(opponent, lang) })}`
                        : ""}
                    </p>
                  </>
                ) : (
                  <div
                    className="hero-row2"
                    aria-label={t("hero.daysAria", { d: calDays ?? "—" })}
                  >
                    {t("hero.in")}{" "}
                    <span className="em-num">
                      {calDays != null ? pad2(calDays) : "—"}
                    </span>
                    <span className="d">{t("hero.days")}</span>
                  </div>
                )}

                {hydrated ? (
                  <Countdown kickoffUTC={focus.kickoffUTC} nowMs={nowMs} />
                ) : (
                  <CountdownPlaceholder />
                )}
              </>
            )}

            <a href="#grade" className="hero-cta">
              {t("hero.cta")}
              <ArrowDownSvg />
            </a>
          </div>

          {focus && (
            <aside className={live ? "hero-match is-live" : "hero-match"}>
              <span className="hero-match-tag">
                {live ? t("hero.liveTag") : t("hero.nextTag")}
              </span>
              <div className="vs-row">
                <div className="jersey-wrap">
                  <span className="jersey">
                    <Jersey team={focus.mandante} size={62} />
                  </span>
                  <span className="country">
                    {teamName(focus.mandante, lang).toUpperCase()}
                  </span>
                </div>
                {focusScore ? (
                  <span className="hero-score">
                    {focusScore.golsMandante}
                    <i>×</i>
                    {focusScore.golsVisitante}
                  </span>
                ) : (
                  <span className="x">×</span>
                )}
                <div className="jersey-wrap right">
                  <span className="jersey">
                    <Jersey team={focus.visitante} size={62} />
                  </span>
                  <span className="country">
                    {teamName(focus.visitante, lang).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <div className="meta-line">
                  {focus.grupo ? `${t("hero.group", { g: focus.grupo })} · ` : ""}
                  {t(`stage.${focus.stage}`)} ·{" "}
                  <span>{fmtDay(focus.kickoffUTC, tzOffset, lang)}</span>
                </div>
                <div className="stadium">{focus.estadio.toUpperCase()}</div>
                <div className="when">
                  {cityName(focus.cidade, lang)} ·{" "}
                  {fmtTime(focus.kickoffUTC, tzOffset)} {tzLabel(tzOffset)}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
