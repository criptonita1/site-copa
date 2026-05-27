/**
 * Catálogo de seleções para renderização das camisas SVG.
 * Cores são aproximações ilustrativas — NÃO licenciadas (proibido usar escudos oficiais).
 * Qualquer seleção ausente cai num default neutro (jersey.ts).
 */

export interface TeamJersey {
  body: string;
  accent: string;
  shorts: string;
  num: string;
  stripe?: boolean;
  checker?: boolean;
  abbr?: string;
}

export const TEAMS: Record<string, TeamJersey> = {
  // Anfitriões
  EUA: { body: "#fff", accent: "#1D3FA1", shorts: "#1D3FA1", num: "10", abbr: "EUA" },
  México: { body: "#00A045", accent: "#fff", shorts: "#fff", num: "9", abbr: "MEX" },
  Canadá: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "11", abbr: "CAN" },

  // Conmebol
  Brasil: { body: "#FFDB2A", accent: "#00A045", shorts: "#1D3FA1", num: "10", abbr: "BRA" },
  Argentina: {
    body: "#7BB8E8",
    accent: "#fff",
    shorts: "#0d0d0d",
    num: "10",
    stripe: true,
    abbr: "ARG",
  },
  Uruguai: { body: "#7BB8E8", accent: "#fff", shorts: "#0d0d0d", num: "9", abbr: "URU" },
  Colômbia: { body: "#FFDB2A", accent: "#1D3FA1", shorts: "#1D3FA1", num: "10", abbr: "COL" },
  Equador: { body: "#FFDB2A", accent: "#1D3FA1", shorts: "#1D3FA1", num: "9", abbr: "EQU" },
  Paraguai: { body: "#D02E2E", accent: "#1D3FA1", shorts: "#1D3FA1", num: "7", stripe: true, abbr: "PAR" },

  // UEFA
  Inglaterra: { body: "#fff", accent: "#D02E2E", shorts: "#0d0d0d", num: "9", abbr: "ING" },
  França: { body: "#1A3D9E", accent: "#fff", shorts: "#fff", num: "10", abbr: "FRA" },
  Espanha: { body: "#D02E2E", accent: "#FFDB2A", shorts: "#1D3FA1", num: "7", abbr: "ESP" },
  "Países Baixos": { body: "#FF7A1F", accent: "#0d0d0d", shorts: "#0d0d0d", num: "14", abbr: "HOL" },
  Alemanha: { body: "#fff", accent: "#0d0d0d", shorts: "#0d0d0d", num: "8", abbr: "ALE" },
  Portugal: { body: "#8C1A1A", accent: "#00A045", shorts: "#fff", num: "7", abbr: "POR" },
  Bélgica: { body: "#D02E2E", accent: "#FFDB2A", shorts: "#0d0d0d", num: "10", abbr: "BEL" },
  Croácia: { body: "#fff", accent: "#D02E2E", shorts: "#1D3FA1", num: "10", checker: true, abbr: "CRO" },
  Suíça: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "10", abbr: "SUI" },
  Áustria: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "10", abbr: "AUT" },
  Noruega: { body: "#D02E2E", accent: "#1D3FA1", shorts: "#fff", num: "9", abbr: "NOR" },
  Escócia: { body: "#1A3D9E", accent: "#fff", shorts: "#fff", num: "10", abbr: "ESC" },

  // UEFA — vagas da repescagem (mar/2026)
  Turquia: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "10", abbr: "TUR" },
  Suécia: { body: "#FFDB2A", accent: "#1A3D9E", shorts: "#1A3D9E", num: "10", abbr: "SUE" },
  "República Tcheca": { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "9", abbr: "TCH" },
  "Bósnia e Herzegovina": {
    body: "#1A3D9E",
    accent: "#FFDB2A",
    shorts: "#fff",
    num: "10",
    abbr: "BOS",
  },

  // AFC
  Japão: { body: "#1A3D9E", accent: "#fff", shorts: "#fff", num: "10", abbr: "JAP" },
  "Coreia do Sul": { body: "#D02E2E", accent: "#1A3D9E", shorts: "#1A3D9E", num: "7", abbr: "COR" },
  "Arábia Saudita": { body: "#00A045", accent: "#fff", shorts: "#fff", num: "10", abbr: "ARA" },
  Irã: { body: "#fff", accent: "#D02E2E", shorts: "#D02E2E", num: "20", abbr: "IRA" },
  Austrália: { body: "#FFDB2A", accent: "#00A045", shorts: "#00A045", num: "10", abbr: "AUS" },
  Uzbequistão: { body: "#fff", accent: "#00A045", shorts: "#1A3D9E", num: "9", abbr: "UZB" },
  Catar: { body: "#7B1B45", accent: "#fff", shorts: "#fff", num: "10", abbr: "CAT" },
  Jordânia: { body: "#fff", accent: "#D02E2E", shorts: "#0d0d0d", num: "10", abbr: "JOR" },

  // CAF
  Marrocos: { body: "#C72424", accent: "#00A045", shorts: "#00A045", num: "7", abbr: "MAR" },
  Senegal: { body: "#fff", accent: "#00A045", shorts: "#00A045", num: "10", abbr: "SEN" },
  Tunísia: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "10", abbr: "TUN" },
  Egito: { body: "#D02E2E", accent: "#fff", shorts: "#fff", num: "10", abbr: "EGI" },
  Argélia: { body: "#fff", accent: "#00A045", shorts: "#00A045", num: "7", abbr: "ARL" },
  "África do Sul": { body: "#FFDB2A", accent: "#00A045", shorts: "#00A045", num: "10", abbr: "AFS" },
  Gana: { body: "#fff", accent: "#D02E2E", shorts: "#FFDB2A", num: "10", abbr: "GAN" },
  "Costa do Marfim": { body: "#FF7A1F", accent: "#fff", shorts: "#00A045", num: "9", abbr: "CIV" },
  "Cabo Verde": { body: "#1A3D9E", accent: "#fff", shorts: "#fff", num: "10", abbr: "CAB" },
  Camarões: { body: "#00A045", accent: "#FFDB2A", shorts: "#D02E2E", num: "9", abbr: "CAM" },
  // CAF — repescagem intercontinental (mar/2026)
  "RD Congo": { body: "#7BB8E8", accent: "#FFDB2A", shorts: "#7BB8E8", num: "10", abbr: "RDC" },

  // AFC — repescagem intercontinental (mar/2026)
  Iraque: { body: "#fff", accent: "#00A045", shorts: "#0d0d0d", num: "10", abbr: "IRQ" },

  // Concacaf + Oceania
  Panamá: { body: "#D02E2E", accent: "#fff", shorts: "#1A3D9E", num: "10", abbr: "PAN" },
  Haiti: { body: "#1A3D9E", accent: "#D02E2E", shorts: "#fff", num: "10", abbr: "HAI" },
  Curaçao: { body: "#1A3D9E", accent: "#FFDB2A", shorts: "#fff", num: "9", abbr: "CUR" },
  "Nova Zelândia": { body: "#fff", accent: "#0d0d0d", shorts: "#0d0d0d", num: "9", abbr: "NZL" },
};

/** Placeholder pra slots de mata-mata ainda não definidos. */
export const TEAM_TBD: TeamJersey = {
  body: "#ecdfc5",
  accent: "#b8a780",
  shorts: "#6b5a3e",
  num: "?",
  abbr: "TBD",
};
