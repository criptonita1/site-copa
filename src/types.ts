/**
 * Fonte de verdade dos tipos do domínio.
 * O JSON em src/data/matches.json é validado contra estes shapes via Zod no prebuild.
 */

export type ChannelId =
  | "globo"
  | "sbt"
  | "sportv"
  | "nsports"
  | "globoplay"
  | "getv"
  | "cazetv";

export type ChannelKind = "free" | "paid";
export type ChannelDelivery = "aberta" | "fechada" | "streaming" | "youtube";

export interface Channel {
  id: ChannelId;
  nome: string;
  abrev: string;
  delivery: ChannelDelivery;
  kind: ChannelKind; // free = grátis, paid = pago
  comoAssistir: string;
  /** Link direto pro canal — quando disponível (YouTube, streaming). */
  url?: string;
}

export type Stage =
  | "abertura"
  | "grupos"
  | "32avos"
  | "oitavas"
  | "quartas"
  | "semi"
  | "terceiro"
  | "final";

export type HostCountry = "EUA" | "México" | "Canadá";

export interface MatchResult {
  /** Gols no tempo normal + prorrogação, se houve. */
  golsMandante: number;
  golsVisitante: number;
  /** Pênaltis: presente só em mata-mata empatado no tempo normal. */
  penaltis?: {
    mandante: number;
    visitante: number;
  };
}

export interface Match {
  id: string;
  kickoffUTC: string;
  /** Horário derivado em America/Sao_Paulo — debug-only, NÃO renderizar. */
  horarioBrasilia: string;
  stage: Stage;
  grupo: string | null;
  mandante: string;
  visitante: string;
  cidade: string;
  pais: HostCountry;
  estadio: string;
  canais: ChannelId[];
  canaisConfirmados: boolean;
  brasil: boolean;
  /** Placar final — presente só depois do jogo acabar. Vira registro do resultado. */
  resultado?: MatchResult;
}

export interface MatchesFile {
  _meta: {
    torneio: string;
    periodo: string;
    fuso_armazenamento: string;
    fonte_jogos: string;
    fonte_canais: string;
    observacao_canais: string;
    total: number;
  };
  matches: Match[];
}

export type MatchState = "upcoming" | "live" | "ended";

export interface MatchWithState extends Match {
  state: MatchState;
  /** minuto aproximado quando live (0..120) */
  minute?: number;
}
