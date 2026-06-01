/**
 * Geração do card compartilhável 1080×1920 (Story).
 * Porte direto do mockup — desenho programático em canvas (sem html2canvas).
 * Roda 100% no client. Aguarda document.fonts.ready pra evitar fallback serif.
 */

import { APP } from "@/config";
import { CHANNELS } from "@/data/channels";
import type { Match, ChannelId } from "@/types";
import { fmtTime, fmtDay, tzLabel } from "@/lib/time";
import type { TimezoneOffset } from "@/config";

export interface RenderShareCardOptions {
  matches: Match[];
  userChannels: Set<ChannelId>;
  tzOffset: TimezoneOffset;
}

export async function renderShareCard({
  matches,
  userChannels,
  tzOffset,
}: RenderShareCardOptions): Promise<Blob> {
  // Espera fontes carregarem
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready;
    } catch {
      /* ignora */
    }
  }

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context indisponível");

  // ---- BG paper
  ctx.fillStyle = "#f4e9d4";
  ctx.fillRect(0, 0, W, H);

  // ---- Faixa de bandeira no topo
  const bandH = 44;
  const seg = W / 3;
  ctx.fillStyle = "#00A045";
  ctx.fillRect(0, 0, seg, bandH);
  ctx.fillStyle = "#FFDB2A";
  ctx.fillRect(seg, 0, seg, bandH);
  ctx.fillStyle = "#1D3FA1";
  ctx.fillRect(seg * 2, 0, seg, bandH);
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, bandH, W, 4);

  // ---- Marca
  ctx.fillStyle = "#0d0d0d";
  ctx.beginPath();
  ctx.arc(96, bandH + 90, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4e9d4";
  ctx.beginPath();
  ctx.arc(96, bandH + 90, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0d0d0d";
  ctx.font = '400 38px "Bungee", sans-serif';
  ctx.textBaseline = "middle";
  ctx.fillText("ONDE VER A ", 136, bandH + 90);
  const w1 = ctx.measureText("ONDE VER A ").width;
  ctx.fillStyle = "#00A045";
  ctx.fillText("COPA", 136 + w1, bandH + 90);
  const w2 = ctx.measureText("COPA").width;
  ctx.fillStyle = "#1D3FA1";
  ctx.font = '700 44px "Caveat", cursive';
  ctx.fillText("!", 136 + w1 + w2 + 6, bandH + 90);

  // ---- Eyebrow
  ctx.fillStyle = "#6b5a3e";
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.fillText("★ MINHA AGENDA · COPA 2026", 96, bandH + 200);

  // ---- Headline
  ctx.fillStyle = "#0d0d0d";
  ctx.font = '400 140px "Anton", sans-serif';
  ctx.textBaseline = "alphabetic";
  ctx.fillText("OS JOGOS", 96, bandH + 340);
  ctx.fillText("QUE ", 96, bandH + 470);
  const wQue = ctx.measureText("QUE ").width;
  // "vou ver" — italic bold (Caveat foi removida do projeto)
  ctx.save();
  ctx.translate(96 + wQue + 30, bandH + 470);
  ctx.rotate(-0.06);
  ctx.fillStyle = "#1D3FA1";
  ctx.font = 'italic 900 110px "Archivo Black", "Archivo", sans-serif';
  ctx.fillText("vou ver", 0, 0);
  ctx.restore();

  // underline amarelo (com lineCap round pra ponta limpa)
  ctx.strokeStyle = "#FFDB2A";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(96 + wQue + 20, bandH + 495);
  ctx.lineTo(96 + wQue + 480, bandH + 488);
  ctx.stroke();
  ctx.lineCap = "butt"; // reset

  // ---- Lista
  let y = bandH + 640;
  // Filtra jogos com times "A definir" — não dá pra "planejar ver" um jogo
  // com slot vazio. O placeholder existe pros jogos de mata-mata pré-grupos.
  const list = matches
    .filter((m) => m.mandante !== "A definir" && m.visitante !== "A definir")
    .slice(0, 5);

  // Hierarquia: TIMES são o protagonista (fonte grande), horário secundário.
  const TAG_X = W - 96 - 160; // 824
  const TIME_X = 96;
  const TIME_FONT = '400 48px "Anton", sans-serif';
  const TEAMS_X = 232; // mais à esquerda agora que o horário é menor
  const TEAMS_FONT = '900 58px "Archivo Black", "Archivo", sans-serif';
  const SUB_FONT = '700 22px "Space Mono", monospace';
  const TEAMS_MAX = TAG_X - TEAMS_X - 20; // 572px

  function fitText(
    c: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    font: string,
  ): string {
    c.font = font;
    if (c.measureText(text).width <= maxWidth) return text;
    let cut = text;
    while (cut.length > 4 && c.measureText(cut + "…").width > maxWidth) {
      cut = cut.slice(0, -1);
    }
    return cut + "…";
  }

  // Estratégia anti-corte (escala progressiva):
  //  1) tenta nome completo
  //  2) abrevia só o mais longo
  //  3) abrevia AMBOS
  //  4) abrevia ambos + ellipsis no mais longo (último recurso)
  //
  // Por que tantos passos: ex. "Coreia do Sul × República Tcheca" é longo
  // demais mesmo abreviando só a República — precisa virar "C. Sul × R. Tcheca".
  function teamsLabel(c: CanvasRenderingContext2D, home: string, away: string): string {
    const full = `${home} × ${away}`;
    c.font = TEAMS_FONT;
    if (c.measureText(full).width <= TEAMS_MAX) return full;

    // Abrevia o nome mantendo a parte distintiva.
    // IMPORTANTE: "África do Sul" NÃO pode virar "África" (país errado).
    // "Coreia do Sul" NÃO pode virar "Coreia". Manter os dois pedaços.
    const abbreviate = (name: string) => {
      // "República Tcheca" → "R. Tcheca" (parts.length === 2, sem conectivos)
      // "Bósnia e Herzegovina" → "Bósnia" (primeira parte é o país)
      // "África do Sul" → "Á. Sul" (manter os dois pedaços, só compactar)
      // "Coreia do Sul" → "C. Sul"
      // "Costa do Marfim" → "C. Marfim"
      // "Países Baixos" → "P. Baixos"
      if (name.includes(" e ")) return name.split(" e ")[0];
      for (const conn of [" do ", " da ", " de "]) {
        if (name.includes(conn)) {
          const [a, b] = name.split(conn);
          return `${a[0]}. ${b}`;
        }
      }
      const parts = name.split(" ");
      if (parts.length >= 2) return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
      return name;
    };

    // Passo 2: abrevia só o mais longo
    const homeAbbrLong = home.length > away.length ? abbreviate(home) : home;
    const awayAbbrLong = away.length >= home.length ? abbreviate(away) : away;
    const tryLong = `${homeAbbrLong} × ${awayAbbrLong}`;
    if (c.measureText(tryLong).width <= TEAMS_MAX) return tryLong;

    // Passo 3: abrevia ambos
    const homeAbbr = abbreviate(home);
    const awayAbbr = abbreviate(away);
    const tryBoth = `${homeAbbr} × ${awayAbbr}`;
    if (c.measureText(tryBoth).width <= TEAMS_MAX) return tryBoth;

    // Passo 4: último recurso — ellipsis no formulário JÁ ABREVIADO
    // (não no original, pra preservar o nome curto + ellipsis no longo).
    return fitText(c, tryBoth, TEAMS_MAX, TEAMS_FONT);
  }

  for (const g of list) {
    const time = fmtTime(g.kickoffUTC, tzOffset);
    // Mantém o mês — "DOM 19 JUL" em vez de "DOM 19" ambíguo
    // (dois dias 19 na Copa: 19/jun e 19/jul → mesma label sem o mês).
    const day = fmtDay(g.kickoffUTC, tzOffset);
    const userVisibleChannels = g.canais.filter((c) => userChannels.has(c));
    const chsLabel = userVisibleChannels
      .map((c) => CHANNELS[c]?.nome ?? c)
      .join(" · ");
    const isBr = g.brasil;

    if (isBr) {
      ctx.fillStyle = "#FFDB2A";
      ctx.fillRect(76, y - 78, W - 152, 150);
      ctx.strokeStyle = "#0d0d0d";
      ctx.lineWidth = 3;
      ctx.strokeRect(76, y - 78, W - 152, 150);
    }

    // TIME (secundário, à esquerda)
    ctx.fillStyle = isBr ? "#0b1e57" : "#0d0d0d";
    ctx.font = TIME_FONT;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(time, TIME_X, y - 6);

    // TEAMS (protagonista, fonte maior)
    ctx.fillStyle = "#0d0d0d";
    const teamsText = teamsLabel(ctx, g.mandante, g.visitante);
    ctx.font = TEAMS_FONT;
    ctx.fillText(teamsText, TEAMS_X, y - 6);

    // Sub (dia + canais) — embaixo do bloco
    ctx.fillStyle = "#6b5a3e";
    ctx.font = SUB_FONT;
    const subText = fitText(
      ctx,
      `${day} · ${chsLabel || "—"}`,
      TAG_X - TIME_X - 20,
      SUB_FONT,
    );
    ctx.fillText(subText, TIME_X, y + 26);

    // Tag direita — antes era "GRÁTIS/PAGO", mas como a CazéTV cobre todos
    // os 104 jogos, a distinção tem pouco valor. Usamos "▶ ASSISTIR" como
    // chamada universal, mais engajadora pro share.
    // Cor verde pra jogo do Brasil (continuidade visual), preta nos demais.
    ctx.save();
    const tagY = y - 50;
    const tagW = 200;
    const tagH = 46;
    ctx.fillStyle = isBr ? "#00A045" : "#0d0d0d";
    ctx.fillRect(TAG_X - 40, tagY, tagW, tagH);
    ctx.strokeStyle = "#0d0d0d";
    ctx.lineWidth = 3;
    ctx.strokeRect(TAG_X - 40, tagY, tagW, tagH);
    // play triangle
    ctx.fillStyle = isBr ? "#FFDB2A" : "#00A045";
    ctx.beginPath();
    ctx.moveTo(TAG_X - 22, tagY + 13);
    ctx.lineTo(TAG_X - 22, tagY + tagH - 13);
    ctx.lineTo(TAG_X - 6, tagY + tagH / 2);
    ctx.closePath();
    ctx.fill();
    // texto
    ctx.fillStyle = isBr ? "#0d0d0d" : "#f4e9d4";
    ctx.font = '400 24px "Bungee", sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("ASSISTIR", TAG_X + 4, tagY + tagH / 2);
    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    if (!isBr) {
      ctx.strokeStyle = "#b8a780";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(96, y + 50);
      ctx.lineTo(W - 96, y + 50);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    y += isBr ? 180 : 140;
  }

  // ---- Rodapé escuro
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, H - 130, W, 130);
  ctx.fillStyle = "#FFDB2A";
  ctx.font = '400 30px "Space Mono", monospace';
  ctx.fillText(APP.SITE_URL.replace(/^https?:\/\//, ""), 96, H - 72);
  // assinatura de autoria (não é o promo)
  ctx.font = '400 18px "Space Mono", monospace';
  ctx.fillStyle = "#b8a780";
  ctx.fillText(`feito por ${APP.AUTHOR_NAME}`, 96, H - 40);
  ctx.fillStyle = "#00A045";
  ctx.font = '400 54px "Bungee", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText(APP.HASHTAG, W - 96, H - 66);
  ctx.textAlign = "left";

  // bandinha bandeira no rodapé
  ctx.fillStyle = "#00A045";
  ctx.fillRect(0, H - 8, W / 3, 8);
  ctx.fillStyle = "#FFDB2A";
  ctx.fillRect(W / 3, H - 8, W / 3, 8);
  ctx.fillStyle = "#1D3FA1";
  ctx.fillRect((2 * W) / 3, H - 8, W / 3, 8);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Falha ao gerar PNG"));
    }, "image/png");
  });
}

export async function downloadShareCard(opts: RenderShareCardOptions): Promise<void> {
  const blob = await renderShareCard(opts);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "onde-ver-a-copa-figurinha.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function shareCard(opts: RenderShareCardOptions): Promise<void> {
  const blob = await renderShareCard(opts);
  const file = new File([blob], "onde-ver-a-copa.png", { type: "image/png" });
  const nav = navigator as Navigator & {
    share?: (data: ShareData & { files?: File[] }) => Promise<void>;
    canShare?: (data: ShareData & { files?: File[] }) => boolean;
  };
  const data = {
    files: [file],
    title: "Minha agenda da Copa 2026",
    text: `Os jogos que eu vou ver na Copa 2026 — ${APP.SITE_URL}`,
  };
  if (nav.share && (!nav.canShare || nav.canShare(data))) {
    try {
      await nav.share(data);
      return;
    } catch {
      // user cancelou — fallback pro download
    }
  }
  await downloadShareCard(opts);
}
