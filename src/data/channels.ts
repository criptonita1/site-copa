import type { Channel, ChannelId } from "@/types";

export const CHANNELS: Record<ChannelId, Channel> = {
  globo: {
    id: "globo",
    nome: "Globo",
    abrev: "GLOBO",
    delivery: "aberta",
    kind: "free",
    comoAssistir: "Antena ou Globoplay grátis",
    url: "https://globoplay.globo.com/agora-na-tv/",
  },
  sbt: {
    id: "sbt",
    nome: "SBT",
    abrev: "SBT",
    delivery: "aberta",
    kind: "free",
    comoAssistir: "Antena — narração Galvão + Leifert",
    url: "https://www.sbt.com.br/ao-vivo",
  },
  cazetv: {
    id: "cazetv",
    nome: "CazéTV",
    abrev: "CAZÉ",
    delivery: "youtube",
    kind: "free",
    comoAssistir: "YouTube — todos os 104 jogos",
    url: "https://www.youtube.com/@CazeTV",
  },
  sportv: {
    id: "sportv",
    nome: "SporTV",
    abrev: "SPORTV",
    delivery: "fechada",
    kind: "paid",
    comoAssistir: "TV por assinatura (sinal 4K)",
    url: "https://sportv.globo.com/",
  },
  nsports: {
    id: "nsports",
    nome: "N Sports",
    abrev: "N SPORTS",
    delivery: "youtube",
    kind: "free",
    comoAssistir: "YouTube — grátis no canal do Neymar",
    url: "https://www.youtube.com/@NSports",
  },
  globoplay: {
    id: "globoplay",
    nome: "Globoplay",
    abrev: "GLOBOPLAY",
    delivery: "streaming",
    kind: "paid", // hub paid no geral; jogos da Globo são livres com plano básico
    comoAssistir: "Streaming Globo",
    url: "https://globoplay.globo.com/",
  },
  getv: {
    id: "getv",
    nome: "ge tv",
    abrev: "GE TV",
    delivery: "streaming",
    kind: "paid",
    comoAssistir: "Via Globoplay",
    url: "https://ge.globo.com/",
  },
};

/** Canais que aparecem nos chips do filtro (5 principais, ordem importa). */
export const FILTERABLE_CHANNELS: ChannelId[] = [
  "globo",
  "sbt",
  "cazetv",
  "sportv",
  "nsports",
];

/** Default: usuário começa com todos os grátis marcados. */
export const DEFAULT_USER_CHANNELS: ChannelId[] = [
  "globo",
  "sbt",
  "cazetv",
  "nsports",
];

/** Constantes pré-computadas para evitar `.filter()` a cada render do FilterPanel. */
export const FREE_CHANNELS: ChannelId[] = FILTERABLE_CHANNELS.filter(
  (id) => CHANNELS[id].kind === "free",
);
export const PAID_CHANNELS: ChannelId[] = FILTERABLE_CHANNELS.filter(
  (id) => CHANNELS[id].kind === "paid",
);
