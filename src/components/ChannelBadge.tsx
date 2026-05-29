import { CHANNELS } from "@/data/channels";
import type { ChannelId } from "@/types";

export function ChannelBadge({ id }: { id: ChannelId }) {
  const ch = CHANNELS[id];
  if (!ch) return null;
  const cls = ch.kind === "free" ? "badge free" : "badge paid";
  const tag = ch.kind === "free" ? "GRÁTIS" : "PAGO";
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
        title={`${ch.comoAssistir} — clique pra abrir`}
        aria-label={`${ch.nome} — ${tag} — abre em nova aba`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cls}
      title={ch.comoAssistir}
      aria-label={`${ch.nome} — ${tag}`}
    >
      {content}
    </span>
  );
}
