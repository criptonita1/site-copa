/**
 * Sincroniza matches.json com /tmp/fifa-parsed.json (todos os 104 jogos
 * extraídos do PDF oficial FIFA com horário Brasília).
 *
 * Estratégia:
 *  - GRUPOS: match por par mandante/visitante (ignora ordem). Atualiza
 *    kickoffUTC + horarioBrasilia + grupo.
 *  - MATA-MATA: ordem cronológica do PDF mapeia 1:1 pros IDs M073-M104.
 *    Atualiza kickoffUTC + horarioBrasilia (preserva mandante/visitante
 *    "A definir" e os campos cidade/estadio do JSON canônico).
 *
 * NÃO altera: estádio, cidade, país, canais, brasil flag (esses ficam
 * sob nossa curadoria; o PDF usa nomes genéricos tipo "Estádio de Boston").
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

type ParsedGame = {
  date: [number, number, number]; // [Y, M, D] da data DO LOCAL
  time: string; // "HH:MM" em BRT (PDF foi configurado em ONDE OBSERVAR: Brasil)
  home: string;
  away: string;
  home_team: string;
  away_team: string;
  stage: string;
  stage_pt: string;
  grupo: string | null;
  stadium: string;
  city: string;
};

const parsed = JSON.parse(readFileSync("/tmp/fifa-parsed.json", "utf8")) as ParsedGame[];

const jsonPath = resolve(process.cwd(), "src/data/matches.json");
copyFileSync(jsonPath, "/tmp/matches.before-pdf-sync.json");

type Match = {
  id: string;
  kickoffUTC: string;
  horarioBrasilia: string;
  stage: string;
  grupo: string | null;
  mandante: string;
  visitante: string;
  estadio: string;
  cidade: string;
  [k: string]: unknown;
};

const data = JSON.parse(readFileSync(jsonPath, "utf8")) as {
  _meta: Record<string, unknown>;
  matches: Match[];
};

/**
 * IMPORTANTE: o PDF foi extraído com filter "ONDE OBSERVAR: Brasil",
 * então TODOS os horários já estão em Brasília. Mas a DATA mostrada
 * pelo PDF é a data local do estádio (não da Brasília). Pra horários
 * tipo 01:00 BRT que aparecem em datas "13/06" no PDF, o real é o
 * dia 14/06 BRT em Brasília se ultrapassar meia-noite local.
 *
 * Felizmente: como o PDF foi configurado pra mostrar BRT, ele JÁ
 * coloca esses horários "spillover" no dia correto da semana
 * (i.e., joga "01:00" sob "sábado 14 junho" se for o caso).
 *
 * Confirmado: o PDF respeita a data brasileira porque o usuário
 * setou ONDE OBSERVAR=Brasil. Então (date, time) do parsed = BRT.
 */
function brtToUTC(date: [number, number, number], time: string): string {
  const [Y, M, D] = date;
  const [h, m] = time.split(":").map(Number);
  // BRT = UTC-3, então UTC = BRT + 3h
  const utcMs = Date.UTC(Y, M - 1, D, h + 3, m, 0);
  return new Date(utcMs).toISOString().replace(".000Z", "Z");
}

function brtLabel(date: [number, number, number], time: string): string {
  const [, M, D] = date;
  return `${String(D).padStart(2, "0")}/${String(M).padStart(2, "0")} ${time}`;
}

// 1) GRUPOS — match por par
const groupsParsed = parsed.filter((p) => p.stage === "grupos");
let groupsUpdated = 0;
const groupsMissing: string[] = [];

for (const game of groupsParsed) {
  const match = data.matches.find(
    (m) =>
      (m.stage === "grupos" || m.stage === "abertura") &&
      ((m.mandante === game.home_team && m.visitante === game.away_team) ||
        (m.mandante === game.away_team && m.visitante === game.home_team)),
  );
  if (!match) {
    groupsMissing.push(`${game.home_team} × ${game.away_team}`);
    continue;
  }
  const utc = brtToUTC(game.date, game.time);
  const label = brtLabel(game.date, game.time);
  const changed =
    match.kickoffUTC !== utc ||
    match.horarioBrasilia !== label ||
    (game.grupo && match.grupo !== game.grupo);
  if (changed) {
    match.kickoffUTC = utc;
    match.horarioBrasilia = label;
    if (game.grupo) match.grupo = game.grupo;
    groupsUpdated++;
  }
}

// 2) MATA-MATA — ordem cronológica do PDF mapeia pros IDs MNNN
const KNOCKOUT_STAGES = ["32avos", "oitavas", "quartas", "semi", "terceiro", "final"];
let knockoutUpdated = 0;

for (const stageName of KNOCKOUT_STAGES) {
  const pdfGames = parsed
    .filter((p) => p.stage === stageName)
    .sort((a, b) => {
      const da = Date.UTC(a.date[0], a.date[1] - 1, a.date[2]);
      const db = Date.UTC(b.date[0], b.date[1] - 1, b.date[2]);
      if (da !== db) return da - db;
      return a.time.localeCompare(b.time);
    });

  const jsonGames = data.matches
    .filter((m) => m.stage === stageName)
    .sort((a, b) => a.id.localeCompare(b.id));

  if (pdfGames.length !== jsonGames.length) {
    console.warn(
      `⚠️  ${stageName}: PDF tem ${pdfGames.length}, JSON tem ${jsonGames.length} — pulando.`,
    );
    continue;
  }

  for (let i = 0; i < pdfGames.length; i++) {
    const pdf = pdfGames[i];
    const m = jsonGames[i];
    const utc = brtToUTC(pdf.date, pdf.time);
    const label = brtLabel(pdf.date, pdf.time);
    if (m.kickoffUTC !== utc || m.horarioBrasilia !== label) {
      m.kickoffUTC = utc;
      m.horarioBrasilia = label;
      knockoutUpdated++;
    }
  }
}

// Re-ordena cronologicamente (invariante validate-matches)
data.matches.sort(
  (a, b) =>
    new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
);

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`\n📋 Sincronização com PDF FIFA:`);
console.log(`   Grupos atualizados:    ${groupsUpdated}/${groupsParsed.length}`);
console.log(`   Mata-mata atualizados: ${knockoutUpdated}`);
if (groupsMissing.length > 0) {
  console.log(`\n⚠️  Pares não encontrados no JSON:`);
  groupsMissing.forEach((p) => console.log(`     - ${p}`));
}
console.log(`\nBackup: /tmp/matches.before-pdf-sync.json`);
