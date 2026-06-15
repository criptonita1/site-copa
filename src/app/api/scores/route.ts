import { NextResponse } from "next/server";
import { MATCHES } from "@/lib/matches";
import type { MatchResult } from "@/types";

export const runtime = "edge";

/**
 * Placar automático via API pública (não-oficial) da ESPN.
 *
 * A ESPN expõe o scoreboard da Copa em JSON sem autenticação. Buscamos o
 * range inteiro do torneio numa requisição e mapeamos cada jogo pro nosso ID
 * por CÓDIGO FIFA (estável) das duas seleções. As datas da ESPN são UTC, igual
 * ao nosso kickoffUTC.
 *
 * Defensivo por princípio: qualquer falha → 200 com scores vazio. O site nunca
 * quebra por causa de um provider externo; no pior caso, só não mostra placar.
 */

const ESPN =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260720&limit=500";

/** Nome da seleção (pt, como está em matches.json) → código FIFA usado pela ESPN. */
const FIFA: Record<string, string> = {
  EUA: "USA",
  México: "MEX",
  Canadá: "CAN",
  Brasil: "BRA",
  Argentina: "ARG",
  Uruguai: "URU",
  Colômbia: "COL",
  Equador: "ECU",
  Paraguai: "PAR",
  Inglaterra: "ENG",
  França: "FRA",
  Espanha: "ESP",
  "Países Baixos": "NED",
  Alemanha: "GER",
  Portugal: "POR",
  Bélgica: "BEL",
  Croácia: "CRO",
  Suíça: "SUI",
  Áustria: "AUT",
  Noruega: "NOR",
  Escócia: "SCO",
  Turquia: "TUR",
  Suécia: "SWE",
  "República Tcheca": "CZE",
  "Bósnia e Herzegovina": "BIH",
  Japão: "JPN",
  "Coreia do Sul": "KOR",
  "Arábia Saudita": "KSA",
  Irã: "IRN",
  Austrália: "AUS",
  Uzbequistão: "UZB",
  Catar: "QAT",
  Jordânia: "JOR",
  Marrocos: "MAR",
  Senegal: "SEN",
  Tunísia: "TUN",
  Egito: "EGY",
  Argélia: "ALG",
  "África do Sul": "RSA",
  Gana: "GHA",
  "Costa do Marfim": "CIV",
  "Cabo Verde": "CPV",
  Camarões: "CMR",
  "RD Congo": "COD",
  Iraque: "IRQ",
  Panamá: "PAN",
  Haiti: "HAI",
  Curaçao: "CUW",
  "Nova Zelândia": "NZL",
};

type EspnState = "pre" | "in" | "post";
interface ScoreEntry extends MatchResult {
  /** "post" = encerrado, "in" = ao vivo. Jogos "pre" não entram. */
  status: "in" | "post";
  /** "FT", "45'", etc. — texto curto da ESPN pra contexto. */
  detail: string;
}

interface EspnHit {
  byCode: Record<string, number>;
  pens?: Record<string, number>;
  state: "in" | "post";
  detail: string;
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

/** Indexa o JSON da ESPN por par de códigos FIFA → placar + estado. */
function indexEspn(json: unknown): Map<string, EspnHit> {
  const out = new Map<string, EspnHit>();
  const events = (json as { events?: unknown[] })?.events;
  if (!Array.isArray(events)) return out;

  for (const ev of events) {
    const comp = (ev as { competitions?: unknown[] }).competitions?.[0] as
      | {
          competitors?: Array<{
            team?: { abbreviation?: string };
            score?: string | number;
            shootoutScore?: string | number;
          }>;
          status?: { type?: { state?: EspnState; shortDetail?: string } };
        }
      | undefined;
    const competitors = comp?.competitors;
    if (!Array.isArray(competitors) || competitors.length !== 2) continue;

    const codes: string[] = [];
    const byCode: Record<string, number> = {};
    const pens: Record<string, number> = {};
    let hasPens = false;
    for (const c of competitors) {
      const code = c.team?.abbreviation;
      if (!code) continue;
      codes.push(code);
      byCode[code] = Number(c.score ?? 0);
      if (c.shootoutScore != null && c.shootoutScore !== "") {
        pens[code] = Number(c.shootoutScore);
        hasPens = true;
      }
    }
    if (codes.length !== 2) continue;

    const state = comp?.status?.type?.state;
    if (state !== "in" && state !== "post") continue;

    out.set(pairKey(codes[0], codes[1]), {
      byCode,
      pens: hasPens ? pens : undefined,
      state,
      detail: comp?.status?.type?.shortDetail ?? "",
    });
  }
  return out;
}

export async function GET() {
  const scores: Record<string, ScoreEntry> = {};

  try {
    const res = await fetch(ESPN, {
      // Revalida a cada 60s: a ESPN é chamada ~1×/min no máximo.
      next: { revalidate: 60 },
      headers: { accept: "application/json" },
    });
    if (res.ok) {
      const index = indexEspn(await res.json());

      for (const m of MATCHES) {
        const home = FIFA[m.mandante];
        const away = FIFA[m.visitante];
        if (!home || !away) continue; // "A definir" / seleção não mapeada
        const hit = index.get(pairKey(home, away));
        if (!hit) continue;

        const golsMandante = hit.byCode[home];
        const golsVisitante = hit.byCode[away];
        if (golsMandante == null || golsVisitante == null) continue;

        const entry: ScoreEntry = {
          golsMandante,
          golsVisitante,
          status: hit.state,
          detail: hit.detail,
        };
        if (hit.pens && hit.pens[home] != null && hit.pens[away] != null) {
          entry.penaltis = {
            mandante: hit.pens[home],
            visitante: hit.pens[away],
          };
        }
        scores[m.id] = entry;
      }
    }
  } catch {
    // engole — devolve o que tiver (possivelmente vazio)
  }

  return NextResponse.json(
    { scores, updatedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
