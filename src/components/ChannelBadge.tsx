"use client";

import { CHANNELS } from "@/data/channels";
import type { ChannelId } from "@/types";
import { useT } from "@/i18n/LangProvider";

export function ChannelBadge({ id }: { id: ChannelId }) {
  const { t } = useT();
  const ch = CHANNELS[id];
  if (!ch) return null;
  const cls = ch.kind === "free" ? "badge free" : "badge paid";
  const tag = ch.kind === "free" ? t("ch.free") : t("ch.paid");
  const content = (
    <>
      {ch.nome}
      <span className="tag">{tag}</span>
    </>
  );

  // Quando o canal tem URL (YouTube, streaming), renderiza como link clicável.
  // Em Globo/SBT/SporTV (TV linear), também levamos pro site oficial — útil
  // pra quem está no celular e quer ir direto pro "ao vivo" do canal.
  if (ch.url) {
    return (
      <a
        href={ch.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={t("ch.openTitle", { how: t(`chan.${ch.id}`) })}
        aria-label={t("ch.openAria", { name: ch.nome, tag })}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cls}
      title={t(`chan.${ch.id}`)}
      aria-label={t("ch.aria", { name: ch.nome, tag })}
    >
      {content}
    </span>
  );
}
