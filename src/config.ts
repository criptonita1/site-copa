/**
 * Configuração de branding / funil.
 * Tudo que for marca deve ler daqui. Trocar de app = mudar este arquivo.
 */
export const APP = {
  // App que este site divulga (PromoSlots — é o CTA, não o autor)
  PROMO_NAME: "Onchain Cup",
  PROMO_URL: "https://onchaincup.io",
  PROMO_TAGLINE: "Viva a Copa com seus amigos — onchain.",

  // Quem ASSINA o site (autoria — diferente do PROMO)
  AUTHOR_NAME: "Modular",
  AUTHOR_URL: "https://x.com/modularcrypto",

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

/**
 * Status do Brasil na Copa. `classificado` acende o selo "Brasil classificado
 * pro mata-mata" no hero. Assertivo de propósito: o site não tem tabela de
 * classificação — quem sabe que o Brasil passou somos nós. O sync diário do
 * mata-mata mantém isso coerente (vira false se o Brasil cair).
 */
export const BRAZIL = {
  classificado: true,
} as const;

/**
 * Bloco de apoio voluntário (footer).
 * Cripto em destaque; Pix discreto como segunda opção.
 * Pra gerar QR estático no build: scripts/generate-qr.ts importa daqui.
 */
export const SUPPORT = {
  PIX: {
    KEY: "1aa7470f-adf7-49ee-bd22-4e31d9daf53d",
    NAME: "JOAO ONDEVERACOPA", // aparece só na preview inicial; Bacen exibe o nome real cadastrado
    CITY: "SAO PAULO",
  },
  ETH: {
    ADDRESS: "0x3C6b397CEc1cAe941DFEbB167F4F8c7863313774",
    NETWORKS: "Ethereum · Base · Arbitrum · Optimism · Polygon",
    WARNING: "Só EVM. Nada de Solana, BSC ou Bitcoin nesse endereço.",
  },
  SOL: {
    ADDRESS: "2TCFRNttUv1sHPHs9pRpiThd5wXpPf7wHZJEEHXy9ayj",
    NETWORKS: "Solana mainnet",
    WARNING: "Só Solana. Não envie de outra rede.",
  },
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
