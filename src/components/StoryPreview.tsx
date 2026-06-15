"use client";

import { APP } from "@/config";
import type { TimezoneOffset } from "@/config";
import { CHANNELS } from "@/data/channels";
import { fmtDay, fmtTime } from "@/lib/time";
import type { ChannelId, Match } from "@/types";
import { useT } from "@/i18n/LangProvider";
import { teamName } from "@/i18n/dict";

interface StoryPreviewProps {
  matches: Match[];
  tzOffset: TimezoneOffset;
  userChannels: Set<ChannelId>;
  nowMs: number;
}

export function StoryPreview({
  matches,
  tzOffset,
  userChannels,
  nowMs,
}: StoryPreviewProps) {
  const { t, lang } = useT();
  const list = matches
    .filter((m) => m.canais.some((c) => userChannels.has(c)))
    .filter((m) => new Date(m.kickoffUTC).getTime() > nowMs)
    // Não dá pra "planejar ver" jogo de mata-mata sem times definidos —
    // mesmo critério aplicado no share-card.ts pra preview bater com o PNG.
    .filter((m) => m.mandante !== "A definir" && m.visitante !== "A definir")
    .slice(0, 5);

  return (
    <div className="story-preview">
      <div className="sp-band" />
      <div className="sp-inner">
        <div className="sp-mark">
          <span className="b" />
          {t("brand.pre")} <span>{t("brand.cup")}</span>!
        </div>
        <div className="sp-head">
          <div className="sp-eyebrow">{t("story.eyebrow")}</div>
          <div className="sp-title">
            {t("story.title1")}
            <br />
            {t("story.title2")} <em>{t("story.titleEm")}</em>
          </div>
        </div>
        <div className="sp-list">
          {list.length === 0 && (
            <div
              style={{
                color: "var(--ink-dim)",
                padding: "20px 4px",
                textAlign: "center",
                fontFamily: "var(--font-caveat), Caveat",
                fontSize: 16,
              }}
            >
              {t("story.empty")}
            </div>
          )}
          {list.map((m) => {
            const time = fmtTime(m.kickoffUTC, tzOffset);
            const day = fmtDay(m.kickoffUTC, tzOffset, lang)
              .split(" ")
              .slice(0, 2)
              .join(" ");
            const userVisible = m.canais.filter((c) => userChannels.has(c));
            const chs = userVisible.map((c) => CHANNELS[c]?.nome ?? c).join(" · ");
            const isFree = userVisible.some((c) => CHANNELS[c]?.kind === "free");
            return (
              <div key={m.id} className={`sp-row${m.brasil ? " brazil" : ""}`}>
                <div className="sp-time">{time}</div>
                <div className="sp-teams">
                  {teamName(m.mandante, lang)} × {teamName(m.visitante, lang)}
                  <span>
                    {day} · {chs}
                  </span>
                </div>
                <div className={`sp-ch ${isFree ? "free" : "paid"}`}>
                  {isFree ? t("ch.free") : t("ch.paid")}
                </div>
              </div>
            );
          })}
        </div>
        <div className="sp-footer">
          <span className="url">{APP.SITE_URL.replace(/^https?:\/\//, "")}</span>
          <span className="hash">{APP.HASHTAG}</span>
        </div>
      </div>
    </div>
  );
}
