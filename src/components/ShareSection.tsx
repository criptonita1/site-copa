"use client";

import { useMemo, useState } from "react";
import { APP } from "@/config";
import type { TimezoneOffset } from "@/config";
import { MATCHES } from "@/lib/matches";
import { downloadIcs } from "@/lib/ics";
import { whatsappLinkGeneric } from "@/lib/whatsapp";
import type { ChannelId } from "@/types";
import { StoryPreview } from "@/components/StoryPreview";
import { DownloadSvg, LinkSvg, WhatsappSvg } from "@/components/icons";

interface ShareSectionProps {
  tzOffset: TimezoneOffset;
  channels: Set<ChannelId>;
  onlyBrazil: boolean;
  nowMs: number;
}

export function ShareSection({
  tzOffset,
  channels,
  onlyBrazil,
  nowMs,
}: ShareSectionProps) {
  const [copyState, setCopyState] = useState<"idle" | "ok">("idle");
  const [downloading, setDownloading] = useState(false);

  // Filtro estável — granularidade de minuto, não precisa do tick de 1s.
  // Evita re-render dessa seção a cada segundo só pra atualizar um filtro.
  const minuteKey = Math.floor(nowMs / 60_000);
  const watchableUpcoming = useMemo(
    () => {
      const t = minuteKey * 60_000;
      return MATCHES.filter(
        (m) =>
          (!onlyBrazil || m.brasil) &&
          m.canais.some((c) => channels.has(c)) &&
          new Date(m.kickoffUTC).getTime() > t,
      );
    },
    [channels, onlyBrazil, minuteKey],
  );

  async function onDownload() {
    setDownloading(true);
    try {
      // Dynamic import — share-card só entra no bundle quando o usuário clica
      const { downloadShareCard } = await import("@/lib/share-card");
      await downloadShareCard({
        matches: watchableUpcoming,
        userChannels: channels,
        tzOffset,
      });
    } finally {
      setDownloading(false);
    }
  }

  async function onShare() {
    try {
      const { shareCard } = await import("@/lib/share-card");
      await shareCard({
        matches: watchableUpcoming,
        userChannels: channels,
        tzOffset,
      });
    } catch {
      /* ignore */
    }
  }

  async function onCopyLink() {
    try {
      await navigator.clipboard.writeText(APP.SITE_URL);
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="share-section">
      <div className="wrap">
        <div className="share-grid">
          <div className="share-copy">
            <div
              className="kicker"
              style={{ color: "var(--amarelo)", marginBottom: 14 }}
            >
              ★ STORY · 1080 × 1920 · PRA POSTAR
            </div>
            <h2>
              JOGA NO <em>grupo do zap</em>.
            </h2>
            <p>
              Geramos uma figurinha-resumo dos jogos que você escolheu, no seu fuso, com
              canal e tudo. Baixa, posta, manda no grupo da família — o tio que ainda
              fala &ldquo;vai passar na Bandeirantes?&rdquo; agradece.
            </p>
            <div className="share-actions">
              <button
                className="btn-primary"
                onClick={onDownload}
                disabled={downloading}
              >
                {downloading ? "GERANDO…" : "BAIXAR FIGURINHA"}
                <DownloadSvg />
              </button>
              <button className="btn-ghost" onClick={onShare}>
                COMPARTILHAR
                <WhatsappSvg />
              </button>
              <a
                className="btn-ghost"
                href={whatsappLinkGeneric()}
                target="_blank"
                rel="noopener noreferrer"
              >
                MANDA NO ZAP
                <WhatsappSvg />
              </a>
              <button
                className="btn-ghost"
                onClick={() => downloadIcs(watchableUpcoming, "copa-2026.ics")}
                title="Baixa um .ics com seus jogos pra Google Agenda / Apple Calendário"
              >
                ADICIONAR AO CALENDÁRIO
                <DownloadSvg />
              </button>
              <button className="btn-ghost" onClick={onCopyLink}>
                {copyState === "ok" ? "✓ COPIADO" : "COPIAR LINK"}
                <LinkSvg />
              </button>
            </div>
          </div>

          <div className="story-wrap">
            <StoryPreview
              matches={watchableUpcoming}
              tzOffset={tzOffset}
              userChannels={channels}
              nowMs={nowMs}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
