/**
 * Configuração de branding / funil.
 * Tudo que for marca deve ler daqui. Trocar de app = mudar este arquivo.
 */
export const APP = {
  // App que este site divulga (PromoSlots — é o CTA, não o autor)
  PROMO_NAME: "Onchain Cup",
  PROMO_URL: "https://onchaincup.io",
  PROMO_TAGLINE: "Aposte na Copa com seus amigos — onchain.",

  // Quem ASSINA o site (autoria — diferente do PROMO)
  AUTHOR_NAME: "Modular",
  AUTHOR_URL: "https://modular.tech",

  // Identidade do site
  SITE_NAME: "Onde Ver a Copa",
  SITE_TAGLINE: "Onde assistir cada jogo da Copa 2026",
  SITE_DESCRIPTION:
    "Marque os canais que você tem e descubra onde assistir cada jogo da Copa do Mundo 2026 — Globo, SBT, CazéTV, SporTV e mais. Countdown pro Brasil, fuso do seu estado, story pra compartilhar no zap.",
  SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://ondeveracopa.com.br",

  DEFAULT_TZ_OFFSET: -3 as const, // Brasília
  HASHTAG: "#COPA26",
} as const;

export type TimezoneOffset = -2 | -3 | -4 | -5;

export const TIMEZONES: Array<{
  offset: TimezoneOffset;
  code: string;
  label: string;
}> = [
  { offset: -3, code: "BRT", label: "BRASÍLIA" },
  { offset: -4, code: "AMT", label: "MANAUS" },
  { offset: -5, code: "ACT", label: "ACRE" },
  { offset: -2, code: "FNT", label: "NORONHA" },
];
