/**
 * Roda no prebuild. Valida src/data/matches.json contra o schema Zod.
 * Quebra o build se: shape errado, IDs duplicados, total != 104, canal inexistente,
 * stage inválida, kickoff fora de ordem cronológica, ou ISO inválido.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const ChannelIdSchema = z.enum([
  "globo",
  "sbt",
  "sportv",
  "nsports",
  "globoplay",
  "getv",
  "cazetv",
]);

const StageSchema = z.enum([
  "abertura",
  "grupos",
  "32avos",
  "oitavas",
  "quartas",
  "semi",
  "terceiro",
  "final",
]);

const PaisSchema = z.enum(["EUA", "México", "Canadá"]);

const MatchResultSchema = z
  .object({
    golsMandante: z.number().int().min(0).max(99),
    golsVisitante: z.number().int().min(0).max(99),
    penaltis: z
      .object({
        mandante: z.number().int().min(0).max(99),
        visitante: z.number().int().min(0).max(99),
      })
      .optional(),
  })
  // Pênaltis só desempata: exigem empate no tempo normal e um vencedor definido.
  .refine(
    (r) => !r.penaltis || r.golsMandante === r.golsVisitante,
    "penaltis só é válido quando golsMandante === golsVisitante (empate)",
  )
  .refine(
    (r) => !r.penaltis || r.penaltis.mandante !== r.penaltis.visitante,
    "penaltis não pode terminar empatado",
  );

const MatchSchema = z.object({
  id: z.string().regex(/^M\d{3}$/, "id deve ser MNNN"),
  kickoffUTC: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), "kickoffUTC inválido"),
  horarioBrasilia: z.string(),
  stage: StageSchema,
  grupo: z.string().nullable(),
  mandante: z.string().min(1),
  visitante: z.string().min(1),
  cidade: z.string().min(1),
  pais: PaisSchema,
  estadio: z.string().min(1),
  canais: z.array(ChannelIdSchema).min(1),
  canaisConfirmados: z.boolean(),
  brasil: z.boolean(),
  resultado: MatchResultSchema.optional(),
});

const FileSchema = z.object({
  _meta: z.object({
    torneio: z.string(),
    periodo: z.string(),
    fuso_armazenamento: z.string(),
    fonte_jogos: z.string(),
    fonte_canais: z.string(),
    observacao_canais: z.string(),
    total: z.number(),
  }),
  matches: z.array(MatchSchema),
});

function fail(msg: string): never {
  console.error(`\n❌ validate-matches: ${msg}\n`);
  process.exit(1);
}

const path = resolve(process.cwd(), "src/data/matches.json");
const raw = readFileSync(path, "utf8");
let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  fail(`JSON inválido: ${(err as Error).message}`);
}

const result = FileSchema.safeParse(parsed);
if (!result.success) {
  console.error(result.error.format());
  fail("Schema Zod falhou. Veja erros acima.");
}

const file = result.data;

// Total esperado
if (file.matches.length !== 104) {
  fail(`Esperado 104 jogos, encontrei ${file.matches.length}.`);
}
if (file._meta.total !== 104) {
  fail(`_meta.total deve ser 104, está ${file._meta.total}.`);
}

// IDs únicos
const ids = new Set<string>();
for (const m of file.matches) {
  if (ids.has(m.id)) fail(`ID duplicado: ${m.id}`);
  ids.add(m.id);
}

// Stage 'grupos'/'abertura' deve ter grupo; demais mata-mata podem ter null
const GROUP_STAGES: ReadonlyArray<typeof file.matches[number]["stage"]> = [
  "grupos",
  "abertura",
];
for (const m of file.matches) {
  if (GROUP_STAGES.includes(m.stage) && !m.grupo) {
    fail(`${m.id} stage=${m.stage} sem campo "grupo".`);
  }
}

// "A definir" só pode aparecer em mata-mata (estágios não-grupais).
const PLACEHOLDER = "A definir";
for (const m of file.matches) {
  if (GROUP_STAGES.includes(m.stage)) {
    if (m.mandante === PLACEHOLDER || m.visitante === PLACEHOLDER) {
      fail(
        `${m.id} (${m.stage}, grupo ${m.grupo}): contém "A definir" em fase de grupos. ` +
          `Todas as 48 seleções já foram sorteadas — atualize com a tabela pós-repescagem.`,
      );
    }
  }
}

// Sanidade: total único de seleções na fase de grupos deve ser exatamente 48
const teamsInGroups = new Set<string>();
for (const m of file.matches) {
  if (GROUP_STAGES.includes(m.stage)) {
    teamsInGroups.add(m.mandante);
    teamsInGroups.add(m.visitante);
  }
}
if (teamsInGroups.size !== 48) {
  fail(
    `Esperado 48 seleções na fase de grupos, encontrei ${teamsInGroups.size}. ` +
      `Lista: ${Array.from(teamsInGroups).sort().join(", ")}`,
  );
}

// Ordem cronológica (pode ter empate de horário, mas nunca volta no tempo)
for (let i = 1; i < file.matches.length; i++) {
  const a = new Date(file.matches[i - 1].kickoffUTC).getTime();
  const b = new Date(file.matches[i].kickoffUTC).getTime();
  if (b < a) {
    fail(
      `Ordem cronológica quebrada entre ${file.matches[i - 1].id} (${file.matches[i - 1].kickoffUTC}) e ${file.matches[i].id} (${file.matches[i].kickoffUTC}).`,
    );
  }
}

// Brasil deve ter pelo menos 3 jogos de fase de grupos
const brBrasil = file.matches.filter((m) => m.brasil);
if (brBrasil.length < 3) {
  fail(`Esperado ao menos 3 jogos do Brasil, encontrei ${brBrasil.length}.`);
}

// Jogos do Brasil devem ter canaisConfirmados = true
for (const m of brBrasil) {
  if (!m.canaisConfirmados) {
    fail(`${m.id} é jogo do Brasil mas canaisConfirmados=false.`);
  }
}

// Window total — 11/jun a 19/jul/2026
const start = Date.UTC(2026, 5, 11);
const end = Date.UTC(2026, 6, 20);
for (const m of file.matches) {
  const t = new Date(m.kickoffUTC).getTime();
  if (t < start || t > end) {
    fail(`${m.id} fora da janela do torneio: ${m.kickoffUTC}`);
  }
}

// Cidade ↔ país: catálogo canônico das 16 cidades-sede
const CIDADE_PAIS: Record<string, "EUA" | "México" | "Canadá"> = {
  // EUA (11)
  "Atlanta": "EUA",
  "Boston (Foxborough)": "EUA",
  "Dallas (Arlington)": "EUA",
  "Filadélfia": "EUA",
  "Houston": "EUA",
  "Kansas City": "EUA",
  "Los Angeles": "EUA",
  "Miami": "EUA",
  "Nova York/Nova Jersey": "EUA",
  "San Francisco (Santa Clara)": "EUA",
  "Seattle": "EUA",
  // México (3)
  "Cidade do México": "México",
  "Guadalajara (Zapopan)": "México",
  "Monterrey (Guadalupe)": "México",
  // Canadá (2)
  "Toronto": "Canadá",
  "Vancouver": "Canadá",
};
for (const m of file.matches) {
  const esperado = CIDADE_PAIS[m.cidade];
  if (!esperado) {
    fail(`${m.id} cidade não reconhecida: "${m.cidade}". Adicione ao catálogo CIDADE_PAIS.`);
  }
  if (esperado !== m.pais) {
    fail(`${m.id}: cidade "${m.cidade}" pertence a ${esperado}, mas o JSON diz ${m.pais}.`);
  }
}

// Estádio ↔ cidade: cada estádio só pode estar em UMA cidade
const estadioCidade = new Map<string, string>();
for (const m of file.matches) {
  const existente = estadioCidade.get(m.estadio);
  if (existente && existente !== m.cidade) {
    fail(
      `${m.id}: estádio "${m.estadio}" aparece em "${m.cidade}" e também em "${existente}". Inconsistência.`,
    );
  }
  estadioCidade.set(m.estadio, m.cidade);
}

// Overlap de estádio no tempo — 2 jogos no mesmo estádio em janelas sobrepostas
const STAGE_DURATION_MS: Record<string, number> = {
  abertura: 110 * 60_000,
  grupos: 110 * 60_000,
  "32avos": 135 * 60_000,
  oitavas: 135 * 60_000,
  quartas: 135 * 60_000,
  semi: 135 * 60_000,
  terceiro: 135 * 60_000,
  final: 135 * 60_000,
};
const byEstadio = new Map<string, typeof file.matches[number][]>();
for (const m of file.matches) {
  if (!byEstadio.has(m.estadio)) byEstadio.set(m.estadio, []);
  byEstadio.get(m.estadio)!.push(m);
}
for (const [estadio, jogos] of byEstadio) {
  const ordered = [...jogos].sort(
    (a, b) =>
      new Date(a.kickoffUTC).getTime() - new Date(b.kickoffUTC).getTime(),
  );
  for (let i = 1; i < ordered.length; i++) {
    const prev = ordered[i - 1];
    const cur = ordered[i];
    const prevStart = new Date(prev.kickoffUTC).getTime();
    const prevEnd = prevStart + (STAGE_DURATION_MS[prev.stage] ?? 110 * 60_000);
    const curStart = new Date(cur.kickoffUTC).getTime();
    if (curStart < prevEnd) {
      fail(
        `Conflito de horário em "${estadio}": ${prev.id} (${prev.kickoffUTC}) ainda está em campo quando ${cur.id} (${cur.kickoffUTC}) começaria.`,
      );
    }
  }
}

console.log(
  `✅ validate-matches: 104 jogos OK · ${brBrasil.length} jogos do Brasil · ${file.matches.filter((m) => m.canaisConfirmados).length} jogos com canais confirmados.`,
);
