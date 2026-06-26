/**
 * sync-knockout — preenche os jogos de mata-mata do matches.json com dados
 * OFICIAIS da Copa, sem inventar nada.
 *
 * Fonte: API pública da ESPN (a mesma já usada pros placares em
 * src/app/api/scores/route.ts). A ESPN espelha o calendário/chaveamento da
 * FIFA: datas, estádios, times resolvidos e os rótulos oficiais de slot
 * (ex.: "2F" = 2º do Grupo F, "3RD" = 3º colocado).
 *
 * O casamento entre um evento da ESPN e o nosso jogo é por KICKOFF (UTC) —
 * que bate exato com o nosso kickoffUTC. Nada de adivinhar mapeamento.
 *
 * Uso:
 *   tsx scripts/sync-knockout.ts            # DRY-RUN: só mostra o diff
 *   tsx scripts/sync-knockout.ts --apply    # grava no matches.json e valida
 *
 * Regras de preenchimento (conservador — na dúvida, mantém "A definir"):
 *  - código FIFA conhecido (BRA, GER, RSA…) → nome PT da seleção
 *  - rótulo de grupo "1F"/"2F" → "1º/2º do Grupo F"
 *  - "3RD" → "3º colocado"
 *  - qualquer outro rótulo (RD32, W1, QFW1…) → mantém "A definir"
 *  - jogo "post" (encerrado) na ESPN → grava `resultado` (gols + pênaltis)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MATCHES_PATH = path.join(__dirname, "..", "src", "data", "matches.json");

const ESPN =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260720&limit=500";

const KNOCKOUT = new Set([
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "terceiro",
  "final",
]);

const TBD = "A definir";

/** Código FIFA (ESPN) → nome da seleção em PT (como está no matches.json). */
const CODE_TO_PT: Record<string, string> = {
  USA: "EUA",
  MEX: "México",
  CAN: "Canadá",
  BRA: "Brasil",
  ARG: "Argentina",
  URU: "Uruguai",
  COL: "Colômbia",
  ECU: "Equador",
  PAR: "Paraguai",
  ENG: "Inglaterra",
  FRA: "França",
  ESP: "Espanha",
  NED: "Países Baixos",
  GER: "Alemanha",
  POR: "Portugal",
  BEL: "Bélgica",
  CRO: "Croácia",
  SUI: "Suíça",
  AUT: "Áustria",
  NOR: "Noruega",
  SCO: "Escócia",
  TUR: "Turquia",
  SWE: "Suécia",
  CZE: "República Tcheca",
  BIH: "Bósnia e Herzegovina",
  JPN: "Japão",
  KOR: "Coreia do Sul",
  KSA: "Arábia Saudita",
  IRN: "Irã",
  AUS: "Austrália",
  UZB: "Uzbequistão",
  QAT: "Catar",
  JOR: "Jordânia",
  MAR: "Marrocos",
  SEN: "Senegal",
  TUN: "Tunísia",
  EGY: "Egito",
  ALG: "Argélia",
  RSA: "África do Sul",
  GHA: "Gana",
  CIV: "Costa do Marfim",
  CPV: "Cabo Verde",
  CMR: "Camarões",
  COD: "RD Congo",
  IRQ: "Iraque",
  PAN: "Panamá",
  HAI: "Haiti",
  CUW: "Curaçao",
  NZL: "Nova Zelândia",
};

interface Competitor {
  team?: { abbreviation?: string };
  score?: string | number;
  shootoutScore?: string | number;
  homeAway?: string;
}
interface EspnEvent {
  date?: string;
  competitions?: Array<{
    competitors?: Competitor[];
    status?: { type?: { state?: string } };
  }>;
}

/** Resolve um rótulo da ESPN pro que vai aparecer no card. null = manter "A definir". */
function resolveSlot(abbr: string | undefined): string | null {
  if (!abbr) return null;
  if (CODE_TO_PT[abbr]) return CODE_TO_PT[abbr]; // seleção definida
  const grp = abbr.match(/^([12])([A-L])$/);
  if (grp) return `${grp[1]}º do Grupo ${grp[2]}`;
  if (abbr === "3RD" || abbr === "3rd") return "3º colocado";
  return null; // RD32, RD16, W1, QFW1, SF L1… → ainda não dá pra cravar
}

async function main() {
  const apply = process.argv.includes("--apply");

  const res = await fetch(ESPN, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`ESPN respondeu ${res.status}`);
  const json = (await res.json()) as { events?: EspnEvent[] };
  const events = json.events ?? [];

  // Indexa eventos da ESPN por timestamp de kickoff (ms).
  const byKickoff = new Map<number, EspnEvent>();
  for (const ev of events) {
    if (ev.date) byKickoff.set(new Date(ev.date).getTime(), ev);
  }

  const file = JSON.parse(readFileSync(MATCHES_PATH, "utf8"));
  const changes: string[] = [];

  // Canais de um jogo do Brasil no mata-mata = exatamente os que já estão
  // CONFIRMADOS nos jogos do Brasil (não invento grade): pego de um jogo
  // existente do Brasil com canais confirmados.
  const brazilRef = file.matches.find(
    (m: { brasil: boolean; canaisConfirmados: boolean; canais: string[] }) =>
      m.brasil && m.canaisConfirmados && m.canais?.length,
  );
  const brazilKoChannels: string[] = brazilRef
    ? [...brazilRef.canais]
    : ["globo"];

  for (const m of file.matches) {
    if (!KNOCKOUT.has(m.stage)) continue;
    const ev = byKickoff.get(new Date(m.kickoffUTC).getTime());
    if (!ev) continue;
    const comp = ev.competitions?.[0];
    const competitors = comp?.competitors ?? [];
    if (competitors.length !== 2) continue;

    // Ordem: respeita home/away da ESPN quando houver; senão, ordem da lista.
    const home =
      competitors.find((c) => c.homeAway === "home") ?? competitors[0];
    const away =
      competitors.find((c) => c.homeAway === "away") ?? competitors[1];

    const newMandante = resolveSlot(home.team?.abbreviation);
    const newVisitante = resolveSlot(away.team?.abbreviation);
    const before = `${m.mandante} x ${m.visitante}`;

    if (newMandante && newMandante !== m.mandante) m.mandante = newMandante;
    if (newVisitante && newVisitante !== m.visitante) m.visitante = newVisitante;

    // Jogo do Brasil: marca a flag e garante canais confirmados.
    const isBR = m.mandante === "Brasil" || m.visitante === "Brasil";
    if (isBR && !m.brasil) {
      m.brasil = true;
      if (!m.canaisConfirmados) {
        m.canais = brazilKoChannels;
        m.canaisConfirmados = true;
      }
    }

    // Resultado final (só quando o jogo encerrou na ESPN).
    if (comp?.status?.type?.state === "post") {
      const gh = Number(home.score ?? NaN);
      const ga = Number(away.score ?? NaN);
      if (Number.isFinite(gh) && Number.isFinite(ga)) {
        const resultado: Record<string, unknown> = {
          golsMandante: gh,
          golsVisitante: ga,
        };
        if (home.shootoutScore != null && away.shootoutScore != null) {
          resultado.penaltis = {
            mandante: Number(home.shootoutScore),
            visitante: Number(away.shootoutScore),
          };
        }
        m.resultado = resultado;
      }
    }

    const after = `${m.mandante} x ${m.visitante}`;
    if (before !== after) changes.push(`  ${m.id} (${m.stage}): ${before}  →  ${after}`);
  }

  if (changes.length === 0) {
    console.log("✅ sync-knockout: nada novo pra atualizar (matches.json já bate com a fonte).");
    return;
  }

  console.log(`\n🔄 sync-knockout: ${changes.length} confronto(s) com dado novo:\n`);
  console.log(changes.join("\n"));

  if (apply) {
    writeFileSync(MATCHES_PATH, JSON.stringify(file, null, 2) + "\n");
    console.log(`\n💾 matches.json atualizado. Rode 'npm run validate' pra confirmar.`);
  } else {
    console.log(`\n👀 DRY-RUN — nada foi gravado. Rode com --apply pra aplicar.`);
  }
}

main().catch((e) => {
  console.error("❌ sync-knockout falhou:", e.message);
  process.exit(1);
});
