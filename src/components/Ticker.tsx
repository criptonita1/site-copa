"use client";

/**
 * Marquee CSS-only — duplica os items pra loop infinito sem JS.
 * As strings i18n (ticker.1..8) já incluem as tags <b>, por isso usamos
 * dangerouslySetInnerHTML pra interpretá-las. Fonte = dicionário constante.
 */

import { useT } from "@/i18n/LangProvider";

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function Ticker() {
  const { t } = useT();
  // duplicado pra animação infinita 100% CSS
  const items = KEYS.map((n) => ({ key: n, html: t(`ticker.${n}`) }));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((item) => (
          <span
            key={`a-${item.key}`}
            className="ticker-item"
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        ))}
        {items.map((item) => (
          <span
            key={`b-${item.key}`}
            className="ticker-item"
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        ))}
      </div>
    </div>
  );
}
