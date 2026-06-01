import { APP } from "@/config";

/**
 * Adiciona UTMs ao link de saída pro Onchain Cup pra rastrear origem
 * e variante do CTA no analytics do app destino.
 */
export function withUtm(url: string, content: string): string {
  try {
    const u = new URL(url);
    const host = new URL(APP.SITE_URL).hostname;
    u.searchParams.set("utm_source", host);
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", "copa-2026");
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * URL self-referenciada com UTMs pra rastrear de onde veio o tráfego
 * que volta pro nosso site (figurinhas, WhatsApp, etc).
 * O Vercel Analytics agrega por URL com query string, então essas
 * variantes aparecem separadas no dashboard como "vindo de share".
 *
 * Uso:
 *  - selfUrlWithUtm("whatsapp", "match") → quando compartilha jogo no zap
 *  - selfUrlWithUtm("whatsapp", "header") → quando compartilha link geral
 *  - selfUrlWithUtm("png", "figurinha") → quando compartilha figurinha
 */
export function selfUrlWithUtm(medium: string, content?: string): string {
  try {
    const u = new URL(APP.SITE_URL);
    u.searchParams.set("utm_source", "share");
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", "copa-2026");
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return APP.SITE_URL;
  }
}
