"use client";

import { memo, useEffect, useRef } from "react";
import type { TimezoneOffset } from "@/config";
import { CHANNELS } from "@/data/channels";
import { Jersey } from "@/lib/jersey";
import { fmtDay, fmtTime, liveMinute, matchState, tzLabel } from "@/lib/time";
import { whatsappLinkForMatch } from "@/lib/whatsapp";
import type { Match } from "@/types";
import { ChannelBadge } from "@/components/ChannelBadge";
import { FlagBrSvg, WhatsappSvg } from "@/components/icons";

interface MatchCardProps {
  match: Match;
  nowMs: number;
  tzOffset: TimezoneOffset;
  userChannels: Set<Match["canais"][number]>;
  /** rotação aplicada inline pra variar — determinística por ID. */
  rotation?: number;
  compact?: boolean;
}

/**
 * "Slice" de tempo relevante pra este card: 0 quando faltam >5min pro jogo
 * E também >5min depois do fim (ou seja, jogo "claramente upcoming" ou
 * "claramente ended"). Pra esses casos não precisamos re-renderizar a cada
 * segundo. Para jogos próximos do início, ao vivo, ou recém-terminados,
 * retornamos o segundo cheio pra manter contadores/estado vivos.
 */
function relevantTimeSlice(match: Match, nowMs: number): number {
  const kickoff = new Date(match.kickoffUTC).getTime();
  const fivemin = 5 * 60_000;
  const matchEnd = kickoff + 150 * 60_000; // 150min = inclui prorrogação + intervalo
  // Janela "interessante": 5min antes do kickoff até 5min depois do fim
  if (nowMs < kickoff - fivemin) {
    // longe do kickoff — granularidade de 1 minuto basta
    return Math.floor(nowMs / 60_000);
  }
  if (nowMs > matchEnd + fivemin) {
    // bem depois do fim — também granularidade de 1 minuto
    return Math.floor(nowMs / 60_000);
  }
  // Janela viva — retorna granularidade de 1s (re-render a cada tick)
  return Math.floor(nowMs / 1000);
}

function deterministicRotation(id: string): number {
  // hash simples → ±0.4 a ±1.2 graus
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const sign = h % 2 === 0 ? -1 : 1;
  const mag = 0.4 + ((Math.abs(h) % 80) / 100);
  return Number((sign * mag).toFixed(2));
}

function MatchCardImpl({
  match,
  nowMs,
  tzOffset,
  userChannels,
  rotation,
  compact,
}: MatchCardProps) {
  const state = matchState(match, nowMs);
  const watchable = match.canais.some((c) => userChannels.has(c));
  const cardRef = useRef<HTMLElement | null>(null);

  const classes = ["card"];
  if (match.brasil) classes.push("brazil");
  if (state === "live") classes.push("live");
  if (state === "ended") classes.push("ended");
  if (compact && !match.brasil && state !== "live") classes.push("compact");
  if (!watchable && state !== "live") classes.push("dim");

  const rot = match.brasil ? 0 : rotation ?? deterministicRotation(match.id);

  // Foil interativo só pra cards do Brasil
  // Funciona com mouse (desktop) E touch (mobile) — usar pointer events cobre os 2
  useEffect(() => {
    if (!match.brasil) return;
    const el = cardRef.current;
    if (!el) return;
    const foil = el.querySelector<HTMLElement>(".foil");
    if (!foil) return;
    function move(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      foil!.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      foil!.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    }
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [match.brasil]);

  const time = fmtTime(match.kickoffUTC, tzOffset);
  const day = fmtDay(match.kickoffUTC, tzOffset);
  const tz = tzLabel(tzOffset);
  const phaseLabel =
    match.stage === "grupos"
      ? `GRUPO ${match.grupo ?? "—"}`
      : match.stage.toUpperCase();

  return (
    <article
      ref={cardRef}
      className={classes.join(" ")}
      data-id={match.id}
      style={{ ["--rot" as string]: `${rot}deg` }}
      aria-label={`${match.mandante} contra ${match.visitante}`}
    >
      {match.brasil && (
        <>
          <div className="foil" aria-hidden="true" />
          <div className="stamp-bra">
            <FlagBrSvg width={20} height={14} className="stamp-flag" />
            BRASIL EM CAMPO!
          </div>
        </>
      )}
      {state === "live" && (
        <div className="live-stamp">
          <span className="dot" />
          AO VIVO
        </div>
      )}

      <div className="strip">
        {/* No card do Brasil, a estampa "BRASIL EM CAMPO!" cobre o lado
            esquerdo da strip; o GRUPO C aqui seria redundante (sempre C).
            Em cards normais, mostra fase + grupo no lado esquerdo. */}
        {!match.brasil && (
          <span className="phase">
            <b>{match.grupo ?? "•"}</b>
            {phaseLabel}
          </span>
        )}
        <span className="date">{day}</span>
      </div>

      <div className="card-body">
        <div className="match">
          <div className="side">
            <span className="jersey">
              <Jersey team={match.mandante} size={54} />
            </span>
            <span className="name">{match.mandante}</span>
          </div>
          <span className="x">×</span>
          <div className="side">
            <span className="jersey">
              <Jersey team={match.visitante} size={54} />
            </span>
            <span className="name">{match.visitante}</span>
          </div>
        </div>

        {state === "live" && (
          <div className="minute">
            ⚽ {liveMinute(match, nowMs)}&apos; · em campo
          </div>
        )}

        <div className="time-zone">
          <div className="time">
            {time}
            <span className="tz">{tz}</span>
          </div>
          <div className="venue">
            <b>{match.estadio}</b>
            {match.cidade}
          </div>
        </div>

        <div className="channels">
          <span className="ch-lbl">passa em →</span>
          {match.canais.map((id) => CHANNELS[id] && <ChannelBadge key={id} id={id} />)}
          <a
            className="badge paid"
            style={{ marginLeft: "auto" }}
            href={whatsappLinkForMatch(match, tzOffset)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no WhatsApp"
            title="Manda pro grupo"
          >
            <WhatsappSvg /> ZAP
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * memo com comparator: o `nowMs` só conta como mudança real quando o card
 * está na "janela viva" (~5min antes do kickoff até 5min depois do fim).
 * Pros 99+ cards distantes, ignoramos atualizações de segundo a segundo —
 * isso elimina o re-render em cascata dos 104 cards a cada tick.
 */
export const MatchCard = memo(MatchCardImpl, (prev, next) => {
  if (prev.match !== next.match) return false;
  if (prev.tzOffset !== next.tzOffset) return false;
  if (prev.userChannels !== next.userChannels) return false;
  if (prev.compact !== next.compact) return false;
  if (prev.rotation !== next.rotation) return false;
  // Compara slices de tempo relevantes — re-render só quando importar
  const prevSlice = relevantTimeSlice(prev.match, prev.nowMs);
  const nextSlice = relevantTimeSlice(next.match, next.nowMs);
  return prevSlice === nextSlice;
});
