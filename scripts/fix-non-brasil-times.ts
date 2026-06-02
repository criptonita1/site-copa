/**
 * Fix one-off: jogos não-Brasil têm kickoffUTC +2h do real.
 *
 * Reportado pelo usuário pós-lançamento:
 *   - Abertura (México × África do Sul): no JSON 18:00 BRT, real 16:00 BRT
 *   - Coreia × Tcheca: no JSON 01:00 BRT, real 23:00 BRT
 * Padrão: todos os jogos com brasil == false estão deslocados +2h.
 *
 * Este script subtrai 2h de kickoffUTC e re-deriva horarioBrasilia
 * pra esses jogos. Backup do JSON original é salvo em /tmp.
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const TWO_H_MS = 2 * 60 * 60 * 1000;
const path = resolve(process.cwd(), "src/data/matches.json");

// Backup defensivo
copyFileSync(path, "/tmp/matches.before-fix.json");

const raw = readFileSync(path, "utf8");
const data = JSON.parse(raw) as {
  _meta: Record<string, unknown>;
  matches: Array<{
    id: string;
    kickoffUTC: string;
    horarioBrasilia: string;
    brasil: boolean;
    [k: string]: unknown;
  }>;
};

// Formata "dd/mm HH:MM" em America/Sao_Paulo (UTC-3, sem DST hoje no Brasil)
function brasiliaLabel(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 3 * 60 * 60 * 1000);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const HH = String(d.getUTCHours()).padStart(2, "0");
  const MM = String(d.getUTCMinutes()).padStart(2, "0");
  return `${dd}/${mm} ${HH}:${MM}`;
}

let fixed = 0;
for (const m of data.matches) {
  if (m.brasil) continue;
  const newKickoff = new Date(new Date(m.kickoffUTC).getTime() - TWO_H_MS);
  m.kickoffUTC = newKickoff.toISOString().replace(".000Z", "Z");
  m.horarioBrasilia = brasiliaLabel(m.kickoffUTC);
  fixed++;
}

// Re-ordena cronologicamente — o shift de -2h pode ter colocado um jogo
// não-Brasil antes de um Brasil mais cedo que ficou parado. Mantém o
// invariante que o validate-matches checa.
data.matches.sort(
  (a, b) =>
    new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
);

writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`✅ ${fixed} jogos não-Brasil corrigidos (-2h).`);
console.log(`   Backup: /tmp/matches.before-fix.json`);
