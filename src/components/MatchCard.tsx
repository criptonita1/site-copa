"use client";

import { memo, useEffect, useRef } from "react";
import type { TimezoneOffset } from "@/config";
import { CHANNELS } from "@/data/channels";
import { Jersey } from "@/lib/jersey";
import { fmtDay, fmtTime, matchState, tzLabel } from "@/lib/time";
import { whatsappLinkForMatch } from "@/lib/whatsapp";
import type { MatchScore } from "@/hooks/useScores";
import type { Match } from "@/types";
import { ChannelBadge } from "@/components/ChannelBadge";
import { FlagBrSvg, WhatsappSvg } from "@/components/icons";
import { useT } from "@/i18n/LangProvider";
import { teamName, cityName } from "@/i18n/dict";

interface MatchCardProps {
  match: Match;
  nowMs: number;
  tzOffset: TimezoneOffset;
  userChannels: Set<Match["canais"][number]>;
  /** rotação aplicada inline pra variar — determinística por ID. */
  rotation?: number;
  compact?: boolean;
  /** Placar automático (final ou ao vivo). Sobrepõe match.resultado. */
  score?: MatchScore;
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
  score,
}: MatchCardProps) {
  const { t, lang } = useT();
  const state = matchState(match, nowMs);
  const watchable = match.canais.some((c) => userChannels.has(c));
  const cardRef = useRef<HTMLElement | null>(null);

  // Placar da API (final ou ao vivo) tem prioridade; cai pro manual do JSON.
  const result = score ?? match.resultado;
  const hasResult = !!result;
  const live = score ? score.live : state === "live";
  const isFinal = hasResult && !live;

  const classes = ["card"];
  if (match.brasil) classes.push("brazil");
  if (live) classes.push("live");
  if (state === "ended" && !live) classes.push("ended");
  if (hasResult) classes.push("has-result");
  if (compact && !match.brasil && !live) classes.push("compact");
  if (!watchable && !live && !hasResult) classes.push("dim");

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
  const day = fmtDay(match.kickoffUTC, tzOffset, lang);
  const tz = tzLabel(tzOffset);
  const phaseLabel =
    match.stage === "grupos"
      ? t("hero.group", { g: match.grupo ?? "—" })
      : t(`stage.${match.stage}`);

  return (
    <article
      ref={cardRef}
      className={classes.join(" ")}
      data-id={match.id}
      style={{ ["--rot" as string]: `${rot}deg` }}
      aria-label={t("card.aria", {
        home: teamName(match.mandante, lang),
        away: teamName(match.visitante, lang),
      })}
    >
      {match.brasil && (
        <>
          <div className="foil" aria-hidden="true" />
          <div className="stamp-bra">
            <FlagBrSvg width={20} height={14} className="stamp-flag" />
            {t("card.brazilStamp")}
          </div>
        </>
      )}
      {live && (
        <div className="live-stamp">
          <span className="dot" />
          {t("card.live")}
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
            <span className="name">{teamName(match.mandante, lang)}</span>
          </div>
          {result ? (
            <div
              className="score"
              aria-label={`${teamName(match.mandante, lang)} ${result.golsMandante}, ${teamName(match.visitante, lang)} ${result.golsVisitante}${
                result.penaltis
                  ? ` (${result.penaltis.mandante} a ${result.penaltis.visitante} nos pênaltis)`
                  : ""
              }`}
            >
              <span className="line">
                <span className="g">{result.golsMandante}</span>
                <span className="sx">×</span>
                <span className="g">{result.golsVisitante}</span>
              </span>
              {result.penaltis && (
                <span className="pens">
                  {result.penaltis.mandante}-{result.penaltis.visitante} {t("card.pens")}
                </span>
              )}
            </div>
          ) : (
            <span className="x">×</span>
          )}
          <div className="side">
            <span className="jersey">
              <Jersey team={match.visitante} size={54} />
            </span>
            <span className="name">{teamName(match.visitante, lang)}</span>
          </div>
        </div>

        {result ? (
          <div className="time-zone result">
            <div className="venue">
              <b>{match.estadio}</b>
              {cityName(match.cidade, lang)}
            </div>
          </div>
        ) : (
          <div className="time-zone">
            <div className="time">
              {time}
              <span className="tz">{tz}</span>
            </div>
            <div className="venue">
              <b>{match.estadio}</b>
              {cityName(match.cidade, lang)}
            </div>
          </div>
        )}

        <div className="channels">
          <span className="ch-lbl">{isFinal ? t("card.airedOn") : t("card.airsOn")}</span>
          {match.canais.map((id) => CHANNELS[id] && <ChannelBadge key={id} id={id} />)}
          <a
            className="badge paid"
            style={{ marginLeft: "auto" }}
            href={whatsappLinkForMatch(match, tzOffset, lang)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("card.waLabel")}
            title={t("card.waTitle")}
          >
            <WhatsappSvg /> {t("card.zap")}
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
function sameScore(a?: MatchScore, b?: MatchScore): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.golsMandante === b.golsMandante &&
    a.golsVisitante === b.golsVisitante &&
    a.live === b.live &&
    a.penaltis?.mandante === b.penaltis?.mandante &&
    a.penaltis?.visitante === b.penaltis?.visitante
  );
}

export const MatchCard = memo(MatchCardImpl, (prev, next) => {
  if (prev.match !== next.match) return false;
  if (prev.tzOffset !== next.tzOffset) return false;
  if (prev.userChannels !== next.userChannels) return false;
  if (prev.compact !== next.compact) return false;
  if (prev.rotation !== next.rotation) return false;
  if (!sameScore(prev.score, next.score)) return false;
  // Compara slices de tempo relevantes — re-render só quando importar
  const prevSlice = relevantTimeSlice(prev.match, prev.nowMs);
  const nextSlice = relevantTimeSlice(next.match, next.nowMs);
  return prevSlice === nextSlice;
});
