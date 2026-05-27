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
  ctx.save();
  ctx.translate(96 + wQue + 30, bandH + 470);
  ctx.rotate(-0.06);
  ctx.fillStyle = "#1D3FA1";
  ctx.font = '700 130px "Caveat", cursive';
  ctx.fillText("vou ver", 0, 0);
  ctx.restore();

  // underline amarelo
  ctx.strokeStyle = "#FFDB2A";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(96 + wQue + 20, bandH + 490);
  ctx.lineTo(96 + wQue + 580, bandH + 482);
  ctx.stroke();

  // ---- Lista
  let y = bandH + 640;
  const list = matches.slice(0, 5);

  for (const g of list) {
    const time = fmtTime(g.kickoffUTC, tzOffset);
    const day = fmtDay(g.kickoffUTC, tzOffset).split(" ").slice(0, 2).join(" ");
    const userVisibleChannels = g.canais.filter((c) => userChannels.has(c));
    const chsLabel = userVisibleChannels
      .map((c) => CHANNELS[c]?.nome ?? c)
      .join(" · ");
    const isFree = userVisibleChannels.some((c) => CHANNELS[c]?.kind === "free");
    const isBr = g.brasil;

    if (isBr) {
      ctx.fillStyle = "#FFDB2A";
      ctx.fillRect(76, y - 78, W - 152, 150);
      ctx.strokeStyle = "#0d0d0d";
      ctx.lineWidth = 3;
      ctx.strokeRect(76, y - 78, W - 152, 150);
    }

    ctx.fillStyle = isBr ? "#0b1e57" : "#0d0d0d";
    ctx.font = '400 92px "Anton", sans-serif';
    ctx.textBaseline = "alphabetic";
    ctx.fillText(time, 96, y);

    ctx.fillStyle = "#0d0d0d";
    ctx.font = '900 42px "Archivo Black", "Archivo", sans-serif';
    ctx.fillText(`${g.mandante} × ${g.visitante}`, 360, y - 26);

    ctx.fillStyle = "#6b5a3e";
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillText(`${day} · ${chsLabel || "—"}`, 360, y + 12);

    // tag direita
    ctx.save();
    const tagX = W - 96 - 160;
    const tagY = y - 50;
    const tagW = 160;
    const tagH = 46;
    ctx.fillStyle = isFree ? "#00A045" : "#1D3FA1";
    ctx.fillRect(tagX, tagY, tagW, tagH);
    ctx.strokeStyle = "#0d0d0d";
    ctx.lineWidth = 3;
    ctx.strokeRect(tagX, tagY, tagW, tagH);
    ctx.fillStyle = isFree ? "#f4e9d4" : "#FFDB2A";
    ctx.font = '400 26px "Bungee", sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(isFree ? "GRÁTIS" : "PAGO", tagX + tagW / 2, tagY + tagH / 2);
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
  // assinatura discreta do Onchain Cup
  ctx.font = '400 18px "Space Mono", monospace';
  ctx.fillStyle = "#b8a780";
  ctx.fillText(`feito por ${APP.PROMO_NAME}`, 96, H - 40);
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
