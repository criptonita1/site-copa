"use client";

import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { APP } from "@/config";
import type { TimezoneOffset } from "@/config";
import { MATCHES } from "@/lib/matches";
import { downloadIcs } from "@/lib/ics";
import type { ChannelId } from "@/types";
import { StoryPreview } from "@/components/StoryPreview";
import { DownloadSvg, LinkSvg, WhatsappSvg } from "@/components/icons";
import { useT } from "@/i18n/LangProvider";

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
  const { t, lang } = useT();
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
    track("share_download_png", {
      matchCount: watchableUpcoming.length,
      onlyBrazil,
      channelCount: channels.size,
    });
    try {
      // Dynamic import — share-card só entra no bundle quando o usuário clica
      const { downloadShareCard } = await import("@/lib/share-card");
      await downloadShareCard({
        matches: watchableUpcoming,
        userChannels: channels,
        tzOffset,
        lang,
      });
    } finally {
      setDownloading(false);
    }
  }

  async function onShare() {
    track("share_native", {
      matchCount: watchableUpcoming.length,
      onlyBrazil,
    });
    try {
      const { shareCard } = await import("@/lib/share-card");
      await shareCard({
        matches: watchableUpcoming,
        userChannels: channels,
        tzOffset,
        lang,
      });
    } catch {
      /* ignore */
    }
  }

  async function onCopyLink() {
    track("share_copy_link");
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
              {t("share.kicker")}
            </div>
            <h2>
              {t("share.h2a")} <em>{t("share.h2em")}</em>.
            </h2>
            <p>{t("share.desc")}</p>
            <div className="share-actions">
              <button
                className="btn-primary"
                onClick={onDownload}
                disabled={downloading}
              >
                {downloading ? t("share.generating") : t("share.download")}
                <DownloadSvg />
              </button>
              <button className="btn-ghost" onClick={onShare}>
                {t("share.whatsapp")}
                <WhatsappSvg />
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  track("share_ics_download", {
                    matchCount: watchableUpcoming.length,
                    onlyBrazil,
                  });
                  downloadIcs(watchableUpcoming, "copa-2026.ics");
                }}
                title={t("share.calTitle")}
              >
                {t("share.calendar")}
                <DownloadSvg />
              </button>
              <button className="btn-ghost" onClick={onCopyLink}>
                {copyState === "ok" ? t("share.copied") : t("share.copyLink")}
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
