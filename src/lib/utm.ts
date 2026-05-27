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
