/**
 * Fix definitivo dos horários da fase de grupos — fonte FIFA oficial.
 *
 * Lições do fix anterior (-2h uniforme): os jogos não-Brasil estavam com
 * offsets DIFERENTES (alguns +2h, outros +3h, outros corretos). Aplicar
 * shift uniforme quebrou alguns que estavam ok.
 *
 * Aqui usamos a tabela oficial da FIFA em BRT pra atualizar cada jogo
 * individualmente pelo PAR de seleções (ignora ordem mandante/visitante).
 *
 * Só toca kickoffUTC e horarioBrasilia. Preserva: id, estadio, cidade,
 * pais, canais, canaisConfirmados, brasil, grupo, stage.
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

type FifaGame = { home: string; away: string; brt: string }; // brt: "2026-06-11 16:00"

const SCHEDULE: FifaGame[] = [
  // 1ª rodada
  { home: "México", away: "África do Sul", brt: "2026-06-11 16:00" },
  { home: "Coreia do Sul", away: "República Tcheca", brt: "2026-06-11 23:00" },
  { home: "Canadá", away: "Bósnia e Herzegovina", brt: "2026-06-12 16:00" },
  { home: "EUA", away: "Paraguai", brt: "2026-06-12 22:00" },
  { home: "Catar", away: "Suíça", brt: "2026-06-13 16:00" },
  { home: "Brasil", away: "Marrocos", brt: "2026-06-13 19:00" },
  { home: "Haiti", away: "Escócia", brt: "2026-06-13 22:00" },
  { home: "Austrália", away: "Turquia", brt: "2026-06-14 01:00" },
  { home: "Alemanha", away: "Curaçao", brt: "2026-06-14 14:00" },
  { home: "Países Baixos", away: "Japão", brt: "2026-06-14 17:00" },
  { home: "Costa do Marfim", away: "Equador", brt: "2026-06-14 20:00" },
  { home: "Suécia", away: "Tunísia", brt: "2026-06-14 23:00" },
  { home: "Espanha", away: "Cabo Verde", brt: "2026-06-15 13:00" },
  { home: "Bélgica", away: "Egito", brt: "2026-06-15 16:00" },
  { home: "Arábia Saudita", away: "Uruguai", brt: "2026-06-15 19:00" },
  { home: "Irã", away: "Nova Zelândia", brt: "2026-06-15 22:00" },
  { home: "França", away: "Senegal", brt: "2026-06-16 16:00" },
  { home: "Iraque", away: "Noruega", brt: "2026-06-16 19:00" },
  { home: "Argentina", away: "Argélia", brt: "2026-06-16 22:00" },
  { home: "Áustria", away: "Jordânia", brt: "2026-06-17 01:00" },
  { home: "Portugal", away: "RD Congo", brt: "2026-06-17 14:00" },
  { home: "Inglaterra", away: "Croácia", brt: "2026-06-17 17:00" },
  { home: "Gana", away: "Panamá", brt: "2026-06-17 20:00" },
  { home: "Uzbequistão", away: "Colômbia", brt: "2026-06-17 21:00" },
  // 2ª rodada
  { home: "República Tcheca", away: "África do Sul", brt: "2026-06-18 13:00" },
  { home: "Suíça", away: "Bósnia e Herzegovina", brt: "2026-06-18 16:00" },
  { home: "Canadá", away: "Catar", brt: "2026-06-18 19:00" },
  { home: "México", away: "Coreia do Sul", brt: "2026-06-18 22:00" },
  { home: "Turquia", away: "Paraguai", brt: "2026-06-19 00:00" },
  { home: "EUA", away: "Austrália", brt: "2026-06-19 16:00" },
  { home: "Escócia", away: "Marrocos", brt: "2026-06-19 19:00" },
  { home: "Brasil", away: "Haiti", brt: "2026-06-19 21:30" },
  { home: "Países Baixos", away: "Suécia", brt: "2026-06-20 14:00" },
  { home: "Alemanha", away: "Costa do Marfim", brt: "2026-06-20 17:00" },
  { home: "Equador", away: "Curaçao", brt: "2026-06-20 21:00" },
  { home: "Tunísia", away: "Japão", brt: "2026-06-20 23:00" },
  { home: "Espanha", away: "Arábia Saudita", brt: "2026-06-21 13:00" },
  { home: "Bélgica", away: "Irã", brt: "2026-06-21 16:00" },
  { home: "Uruguai", away: "Cabo Verde", brt: "2026-06-21 19:00" },
  { home: "Nova Zelândia", away: "Egito", brt: "2026-06-21 22:00" },
  { home: "Argentina", away: "Áustria", brt: "2026-06-22 14:00" },
  { home: "França", away: "Iraque", brt: "2026-06-22 18:00" },
  { home: "Noruega", away: "Senegal", brt: "2026-06-22 21:00" },
  { home: "Jordânia", away: "Argélia", brt: "2026-06-23 00:00" },
  { home: "Portugal", away: "Uzbequistão", brt: "2026-06-23 14:00" },
  { home: "Inglaterra", away: "Gana", brt: "2026-06-23 17:00" },
  { home: "Panamá", away: "Croácia", brt: "2026-06-23 20:00" },
  { home: "Colômbia", away: "RD Congo", brt: "2026-06-23 23:00" },
  // 3ª rodada
  { home: "Suíça", away: "Canadá", brt: "2026-06-24 16:00" },
  { home: "Bósnia e Herzegovina", away: "Catar", brt: "2026-06-24 16:00" },
  { home: "Escócia", away: "Brasil", brt: "2026-06-24 19:00" },
  { home: "Marrocos", away: "Haiti", brt: "2026-06-24 19:00" },
  { home: "República Tcheca", away: "México", brt: "2026-06-24 22:00" },
  { home: "África do Sul", away: "Coreia do Sul", brt: "2026-06-24 22:00" },
  { home: "Equador", away: "Alemanha", brt: "2026-06-25 17:00" },
  { home: "Curaçao", away: "Costa do Marfim", brt: "2026-06-25 17:00" },
  { home: "Japão", away: "Suécia", brt: "2026-06-25 20:00" },
  { home: "Tunísia", away: "Países Baixos", brt: "2026-06-25 20:00" },
  { home: "Turquia", away: "EUA", brt: "2026-06-25 23:00" },
  { home: "Paraguai", away: "Austrália", brt: "2026-06-25 23:00" },
  { home: "Noruega", away: "França", brt: "2026-06-26 16:00" },
  { home: "Senegal", away: "Iraque", brt: "2026-06-26 16:00" },
  { home: "Cabo Verde", away: "Arábia Saudita", brt: "2026-06-26 21:00" },
  { home: "Uruguai", away: "Espanha", brt: "2026-06-26 21:00" },
  { home: "Egito", away: "Irã", brt: "2026-06-27 00:00" },
  { home: "Nova Zelândia", away: "Bélgica", brt: "2026-06-27 00:00" },
  { home: "Panamá", away: "Inglaterra", brt: "2026-06-27 18:00" },
  { home: "Croácia", away: "Gana", brt: "2026-06-27 18:00" },
  { home: "Colômbia", away: "Portugal", brt: "2026-06-27 20:30" },
  { home: "RD Congo", away: "Uzbequistão", brt: "2026-06-27 20:30" },
  { home: "Argélia", away: "Áustria", brt: "2026-06-27 23:00" },
  { home: "Jordânia", away: "Argentina", brt: "2026-06-27 23:00" },
];

const path = resolve(process.cwd(), "src/data/matches.json");
copyFileSync(path, "/tmp/matches.before-fifa-fix.json");

const raw = readFileSync(path, "utf8");
const data = JSON.parse(raw) as {
  _meta: Record<string, unknown>;
  matches: Array<{
    id: string;
    kickoffUTC: string;
    horarioBrasilia: string;
    mandante: string;
    visitante: string;
    stage: string;
    [k: string]: unknown;
  }>;
};

/**
 * BRT "2026-06-11 16:00" → ISO UTC "2026-06-11T19:00:00Z"
 * (BRT é UTC-3, então UTC = BRT + 3h)
 */
function brtToUTC(brt: string): string {
  const [date, time] = brt.split(" ");
  const [Y, M, D] = date.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  const utcMs = Date.UTC(Y, M - 1, D, h + 3, m, 0);
  return new Date(utcMs).toISOString().replace(".000Z", "Z");
}

function brtToBrasiliaLabel(brt: string): string {
  const [date, time] = brt.split(" ");
  const [, M, D] = date.split("-").map(Number);
  return `${String(D).padStart(2, "0")}/${String(M).padStart(2, "0")} ${time}`;
}

let updated = 0;
let notFound = 0;
const missing: string[] = [];

for (const game of SCHEDULE) {
  // Encontra match por par de seleções (ignora ordem)
  const match = data.matches.find(
    (m) =>
      (m.stage === "grupos" || m.stage === "abertura") &&
      ((m.mandante === game.home && m.visitante === game.away) ||
        (m.mandante === game.away && m.visitante === game.home)),
  );
  if (!match) {
    notFound++;
    missing.push(`${game.home} × ${game.away}`);
    continue;
  }
  match.kickoffUTC = brtToUTC(game.brt);
  match.horarioBrasilia = brtToBrasiliaLabel(game.brt);
  updated++;
}

// Re-ordena cronologicamente
data.matches.sort(
  (a, b) =>
    new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
);

writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`✅ ${updated} jogos atualizados.`);
if (notFound > 0) {
  console.log(`⚠️  ${notFound} jogos não encontrados no JSON:`);
  missing.forEach((m) => console.log(`   - ${m}`));
}
console.log(`Backup: /tmp/matches.before-fifa-fix.json`);
