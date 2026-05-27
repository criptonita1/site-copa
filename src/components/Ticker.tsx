/**
 * Marquee CSS-only — duplica o array de items pra loop infinito sem JS.
 * Refator do audit: trocamos dangerouslySetInnerHTML por JSX puro pra
 * eliminar superfície de XSS (mesmo que hoje a fonte seja constante).
 */

import type { ReactNode } from "react";

interface TickerItem {
  /** chave estável pra React */
  key: string;
  /** conteúdo do item */
  node: ReactNode;
}

const ITEMS: TickerItem[] = [
  { key: "estreia", node: <>★ BRASIL ESTREIA <b>13 JUN</b></> },
  { key: "caze", node: <>★ CAZÉTV TRANSMITE <b>104</b> JOGOS</> },
  { key: "globo-sbt", node: <>★ GLOBO + SBT NA TV ABERTA</> },
  { key: "final", node: <>★ FINAL: <b>19 JUL</b> · METLIFE</> },
  { key: "grupoc", node: <>★ GRUPO C: BRA · MAR · ESC · HAI</> },
  { key: "104jogos", node: <><b>104</b> JOGOS · <b>16</b> CIDADES</> },
  { key: "caze-gratis", node: <>★ TÁ DE GRAÇA TUDO QUE PASSA NA CAZÉ</> },
  { key: "datas", node: <>★ 11/JUN A 19/JUL · EUA · MÉX · CAN</> },
];

export function Ticker() {
  // duplicado pra animação infinita 100% CSS
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {ITEMS.map((item) => (
          <span key={`a-${item.key}`} className="ticker-item">
            {item.node}
          </span>
        ))}
        {ITEMS.map((item) => (
          <span key={`b-${item.key}`} className="ticker-item">
            {item.node}
          </span>
        ))}
      </div>
    </div>
  );
}
