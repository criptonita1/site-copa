import { APP } from "@/config";
import { CHANNELS } from "@/data/channels";
import { fmtShortDay, fmtTime } from "@/lib/time";
import { selfUrlWithUtm } from "@/lib/utm";
import type { TimezoneOffset } from "@/config";
import type { Match } from "@/types";

export function whatsappLinkForMatch(match: Match, offset: TimezoneOffset): string {
  const channelsLabel = match.canais
    .slice(0, 3)
    .map((c) => CHANNELS[c]?.nome ?? c)
    .join(", ");
  const url = selfUrlWithUtm("whatsapp", "match");
  const text = `${match.mandante} × ${match.visitante} — ${fmtShortDay(
    match.kickoffUTC,
    offset,
  )} ${fmtTime(match.kickoffUTC, offset)}. Passa em ${channelsLabel}. Veja onde assistir: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function whatsappLinkGeneric(): string {
  const url = selfUrlWithUtm("whatsapp", "generico");
  const text = `Tô usando o ${APP.SITE_NAME} pra saber onde passa cada jogo da Copa 2026 — ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
