/**
 * Gerador de .ics client-side. Não precisa de lib.
 */

import { APP } from "@/config";
import { CHANNELS } from "@/data/channels";
import type { Match } from "@/types";

function icsDate(iso: string): string {
  // YYYYMMDDTHHMMSSZ
  const d = new Date(iso);
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0") +
    "T" +
    String(d.getUTCHours()).padStart(2, "0") +
    String(d.getUTCMinutes()).padStart(2, "0") +
    String(d.getUTCSeconds()).padStart(2, "0") +
    "Z"
  );
}

function durationFor(stage: Match["stage"]): number {
  // minutos pro DTEND
  return stage === "grupos" || stage === "abertura" ? 110 : 135;
}

function escape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

/**
 * Line folding per RFC 5545 §3.1: linhas >75 octets devem ser quebradas
 * com CRLF + um espaço. Caso contrário, Outlook desktop pode interpretar mal.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    const size = i === 0 ? 75 : 74; // primeira linha 75, continuações 74 (já que ganham 1 espaço)
    chunks.push(line.slice(i, i + size));
    i += size;
  }
  return chunks.join("\r\n ");
}

export function buildIcs(matches: Match[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${APP.SITE_NAME}//${APP.SITE_URL}//PT-BR`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const m of matches) {
    const kickoff = new Date(m.kickoffUTC);
    const end = new Date(kickoff.getTime() + durationFor(m.stage) * 60_000);
    const channelsLabel = m.canais
      .map((c) => CHANNELS[c]?.nome ?? c)
      .filter(Boolean)
      .join(", ");
    const summary = `${m.mandante} × ${m.visitante}${m.brasil ? " 🇧🇷" : ""}`;
    const description =
      `Copa do Mundo 2026 · ${m.stage.toUpperCase()}${m.grupo ? " · Grupo " + m.grupo : ""}\\n` +
      `Onde assistir: ${channelsLabel}\\n` +
      `${APP.SITE_URL}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${m.id}@${new URL(APP.SITE_URL).hostname}`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(kickoff.toISOString())}`,
      `DTEND:${icsDate(end.toISOString())}`,
      `SUMMARY:${escape(summary)}`,
      `LOCATION:${escape(`${m.estadio}, ${m.cidade}, ${m.pais}`)}`,
      `DESCRIPTION:${escape(description)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n");
}

export function downloadIcs(matches: Match[], filename = "copa-2026.ics"): void {
  const blob = new Blob([buildIcs(matches)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
