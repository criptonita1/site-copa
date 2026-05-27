import { CHANNELS } from "@/data/channels";
import type { ChannelId } from "@/types";

export function ChannelBadge({ id }: { id: ChannelId }) {
  const ch = CHANNELS[id];
  if (!ch) return null;
  const cls = ch.kind === "free" ? "badge free" : "badge paid";
  const tag = ch.kind === "free" ? "GRÁTIS" : "PAGO";
  return (
    <span
      className={cls}
      title={ch.comoAssistir}
      aria-label={`${ch.nome} — ${tag}`}
    >
      {ch.nome}
      <span className="tag">{tag}</span>
    </span>
  );
}
