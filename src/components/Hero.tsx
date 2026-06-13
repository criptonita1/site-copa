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

interface HeroProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
}

const COUNTDOWN_CELLS: Array<{ key: string; lab: string }> = [
  { key: "d", lab: "dias" },
  { key: "h", lab: "horas" },
  { key: "m", lab: "min" },
  { key: "s", lab: "seg" },
];

/** Placeholder estável pré-hidratação (nowMs===0) — evita piscar número gigante. */
function CountdownPlaceholder() {
  return (
    <div className="cd" aria-hidden="true">
      {COUNTDOWN_CELLS.map((c, i) => (
        <div className={i === 3 ? "cell s" : "cell"} key={c.key}>
          <div className="num">00</div>
          <div className="lab">{c.lab}</div>
        </div>
      ))}
    </div>
  );
}

export function Hero({ nowMs, tzOffset }: HeroProps) {
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

  const subject = isBrazil ? "BRASIL" : "A COPA";
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
            <span className="stamp">EDIÇÃO ESPECIAL</span>
            <span>COPA DO MUNDO · 2026</span>
          </div>
          <div className="right">
            <span className="ed">edição do torcedor — Nº 01</span>
          </div>
        </div>

        <div className="hero-cover">
          <div className="hero-headline">
            {!focus ? (
              /* FIM DE LINHA — nenhum jogo ao vivo nem agendado: a Copa acabou */
              <>
                <h1 className="hero-row1" style={{ margin: 0 }}>
                  ACABOU <span className="joga">a copa</span>
                </h1>
                <div className="hero-row2">
                  <span className="em-num word">2026</span>
                </div>
                <p className="hero-sub">
                  Foi épico. Reveja os 104 jogos aqui embaixo.
                </p>
              </>
            ) : live ? (
              /* AO VIVO — o jogo está rolando AGORA: mostra onde assistir na hora */
              <>
                <h1 className="hero-row1" style={{ margin: 0 }}>
                  {subject} <span className="joga">joga</span>
                </h1>
                <div className="hero-row2 is-live">
                  <span className="agora">AGORA</span>
                  <span className="livebadge" aria-label="ao vivo agora">
                    <span className="dot" aria-hidden="true" />
                    AO VIVO
                  </span>
                </div>
                <div className="hero-live-channels">
                  <span className="lbl">ASSISTA AGORA EM</span>
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
                  {subject} <span className="joga">joga</span>
                </h1>

                {calDays === 0 ? (
                  <>
                    <div className="hero-row2">
                      <span className="em-num word">HOJE</span>
                    </div>
                    <p className="hero-sub">
                      às {fmtTime(focus.kickoffUTC, tzOffset)} {tzLabel(tzOffset)}
                      {opponent ? ` · contra ${opponent}` : ""}
                    </p>
                  </>
                ) : calDays === 1 ? (
                  <>
                    <div className="hero-row2">
                      <span className="em-num word">AMANHÃ</span>
                    </div>
                    <p className="hero-sub">
                      às {fmtTime(focus.kickoffUTC, tzOffset)} {tzLabel(tzOffset)}
                      {opponent ? ` · contra ${opponent}` : ""}
                    </p>
                  </>
                ) : (
                  <div
                    className="hero-row2"
                    aria-label={`Faltam ${calDays ?? "—"} dias`}
                  >
                    EM{" "}
                    <span className="em-num">
                      {calDays != null ? pad2(calDays) : "—"}
                    </span>
                    <span className="d">DIAS</span>
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
              VER ONDE PASSA
              <ArrowDownSvg />
            </a>
          </div>

          {focus && (
            <aside className={live ? "hero-match is-live" : "hero-match"}>
              <div className="vs-row">
                <div className="jersey-wrap">
                  <span className="jersey">
                    <Jersey team={focus.mandante} size={62} />
                  </span>
                  <span className="country">{focus.mandante.toUpperCase()}</span>
                </div>
                <span className="x">×</span>
                <div className="jersey-wrap right">
                  <span className="jersey">
                    <Jersey team={focus.visitante} size={62} />
                  </span>
                  <span className="country">{focus.visitante.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <div className="meta-line">
                  {focus.grupo ? `GRUPO ${focus.grupo} · ` : ""}
                  {focus.stage.toUpperCase()} ·{" "}
                  <span>{fmtDay(focus.kickoffUTC, tzOffset)}</span>
                </div>
                <div className="stadium">{focus.estadio.toUpperCase()}</div>
                <div className="when">
                  {focus.cidade} · {fmtTime(focus.kickoffUTC, tzOffset)}{" "}
                  {tzLabel(tzOffset)}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
