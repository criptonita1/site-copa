"use client";

import { useMemo } from "react";
import type { TimezoneOffset } from "@/config";
import { nextBrazil } from "@/lib/matches";
import { Jersey } from "@/lib/jersey";
import { countdownTo, fmtDay, fmtTime, pad2, tzLabel } from "@/lib/time";
import { ArrowDownSvg } from "@/components/icons";
import { GoalNet } from "@/components/GoalNet";
import { Countdown } from "@/components/Countdown";

interface HeroProps {
  nowMs: number;
  tzOffset: TimezoneOffset;
}

export function Hero({ nowMs, tzOffset }: HeroProps) {
  // nextBrazil é estável em escala de minutos — só muda quando um jogo BR começa
  const minuteKey = Math.floor(nowMs / 60_000);
  const next = useMemo(
    () => nextBrazil(minuteKey * 60_000),
    [minuteKey],
  );
  // Dias até o jogo do Brasil — só pro headline gigante (granular de minuto)
  const daysUntil = useMemo(
    () => (next ? countdownTo(next.kickoffUTC, minuteKey * 60_000).d : null),
    [next, minuteKey],
  );

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
            {/* h1 semântico — Google adora h1 com keyword principal */}
            <h1 className="hero-row1" style={{ margin: 0 }}>
              BRASIL <span className="joga">joga</span>
            </h1>
            <div className="hero-row2" aria-label={`Faltam ${daysUntil ?? "—"} dias`}>
              EM{" "}
              <span className="em-num">
                {daysUntil != null ? pad2(daysUntil) : "—"}
              </span>
              <span className="d">DIAS</span>
            </div>

            {next && <Countdown kickoffUTC={next.kickoffUTC} nowMs={nowMs} />}

            <a href="#grade" className="hero-cta">
              VER ONDE PASSA
              <ArrowDownSvg />
            </a>
          </div>

          {next && (
            <aside className="hero-match">
              <div className="vs-row">
                <div className="jersey-wrap">
                  <span className="jersey">
                    <Jersey team={next.mandante} size={62} />
                  </span>
                  <span className="country">{next.mandante.toUpperCase()}</span>
                </div>
                <span className="x">×</span>
                <div className="jersey-wrap right">
                  <span className="jersey">
                    <Jersey team={next.visitante} size={62} />
                  </span>
                  <span className="country">{next.visitante.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <div className="meta-line">
                  {next.grupo ? `GRUPO ${next.grupo} · ` : ""}
                  {next.stage.toUpperCase()} ·{" "}
                  <span>{fmtDay(next.kickoffUTC, tzOffset)}</span>
                </div>
                <div className="stadium">{next.estadio.toUpperCase()}</div>
                <div className="when">
                  {next.cidade} · {fmtTime(next.kickoffUTC, tzOffset)}{" "}
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
