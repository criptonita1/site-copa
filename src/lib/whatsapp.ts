import { APP } from "@/config";
import { CHANNELS } from "@/data/channels";
import { fmtShortDay, fmtTime } from "@/lib/time";
import { selfUrlWithUtm } from "@/lib/utm";
import { teamName, type Lang } from "@/i18n/dict";
import type { TimezoneOffset } from "@/config";
import type { Match } from "@/types";

export function whatsappLinkForMatch(
  match: Match,
  offset: TimezoneOffset,
  lang: Lang = "pt",
): string {
  const channelsLabel = match.canais
    .slice(0, 3)
    .map((c) => CHANNELS[c]?.nome ?? c)
    .join(", ");
  const url = selfUrlWithUtm("whatsapp", "match");
  const home = teamName(match.mandante, lang);
  const away = teamName(match.visitante, lang);
  const when = `${fmtShortDay(match.kickoffUTC, offset, lang)} ${fmtTime(
    match.kickoffUTC,
    offset,
  )}`;
  const text =
    lang === "en"
      ? `${home} × ${away} — ${when}. Airs on ${channelsLabel}. See where to watch: ${url}`
      : `${home} × ${away} — ${when}. Passa em ${channelsLabel}. Veja onde assistir: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function whatsappLinkGeneric(lang: Lang = "pt"): string {
  const url = selfUrlWithUtm("whatsapp", "generico");
  const text =
    lang === "en"
      ? `I'm using ${APP.SITE_NAME} to find where every 2026 World Cup game airs — ${url}`
      : `Tô usando o ${APP.SITE_NAME} pra saber onde passa cada jogo da Copa 2026 — ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
