/**
 * Divisor entre seções com bola rolando.
 * Porte 1:1 da peça 01 do claude design.
 * FIX: removida a sombra elíptica preta da variante "dark ball" — quando o
 * divisor fica sobre fundo verde-profundo, a sombra escura criava um halo
 * indesejado abaixo da bola (feedback do PO).
 */

type Variant = "dark" | "light";

interface RollingDividerProps {
  /** "dark" = tira preta com bola branca (padrão).
   *  "light" = tira clara com bola preta, ideal sobre fundo verde-profundo. */
  variant?: Variant;
}

function LightBall() {
  // Bola Telstar branca com painéis pretos
  return (
    <svg viewBox="0 0 60 60">
      <ellipse cx="30" cy="58" rx="18" ry="2" fill="#000" opacity=".22" />
      <circle cx="30" cy="30" r="26" fill="#fafaf3" stroke="#0d0d0d" strokeWidth="2" />
      <g
        fill="none"
        stroke="#0d0d0d"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <line x1="30" y1="23.5" x2="34.06" y2="19.41" />
        <line x1="30" y1="23.5" x2="25.94" y2="19.41" />
        <line x1="36.18" y1="27.99" x2="38.82" y2="22.86" />
        <line x1="36.18" y1="27.99" x2="41.33" y2="30.59" />
        <line x1="33.82" y1="35.26" x2="39.51" y2="36.18" />
        <line x1="33.82" y1="35.26" x2="32.94" y2="40.96" />
        <line x1="26.18" y1="35.26" x2="27.06" y2="40.96" />
        <line x1="26.18" y1="35.26" x2="20.49" y2="36.19" />
        <line x1="23.82" y1="27.99" x2="18.67" y2="30.60" />
        <line x1="23.82" y1="27.99" x2="21.18" y2="22.86" />
        <line x1="43.58" y1="19.41" x2="47.21" y2="30.59" />
        <line x1="44.27" y1="39.64" x2="34.76" y2="46.55" />
        <line x1="25.24" y1="46.55" x2="15.73" y2="39.64" />
        <line x1="12.79" y1="30.60" x2="16.42" y2="19.41" />
        <line x1="24.12" y1="13.82" x2="35.88" y2="13.82" />
      </g>
      <g fill="#0d0d0d">
        <polygon points="30,23.5 36.18,27.99 33.82,35.26 26.18,35.26 23.82,27.99" />
        <polygon points="41.76,13.82 43.58,19.41 38.82,22.86 34.06,19.41 35.88,13.82" />
        <polygon points="49.03,36.18 44.27,39.64 39.51,36.18 41.33,30.59 47.21,30.59" />
        <polygon points="30,50 25.24,46.55 27.06,40.96 32.94,40.96 34.76,46.55" />
        <polygon points="10.97,36.19 12.79,30.60 18.67,30.60 20.49,36.19 15.73,39.64" />
        <polygon points="18.24,13.82 24.12,13.82 25.94,19.41 21.18,22.86 16.42,19.41" />
      </g>
      <ellipse
        cx="14"
        cy="14"
        rx="4.5"
        ry="2.2"
        fill="#fff"
        opacity=".7"
        transform="rotate(-30 14 14)"
      />
    </svg>
  );
}

function DarkBall() {
  // Bola preta com painéis paper. Sem ellipse de sombra (causava halo escuro
  // bleed em fundos verde-profundo — fix solicitado pelo PO).
  return (
    <svg viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="#0d0d0d" stroke="#0d0d0d" strokeWidth="2" />
      <g
        fill="none"
        stroke="#f4e9d4"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <line x1="30" y1="23.5" x2="34.06" y2="19.41" />
        <line x1="30" y1="23.5" x2="25.94" y2="19.41" />
        <line x1="36.18" y1="27.99" x2="38.82" y2="22.86" />
        <line x1="36.18" y1="27.99" x2="41.33" y2="30.59" />
        <line x1="33.82" y1="35.26" x2="39.51" y2="36.18" />
        <line x1="33.82" y1="35.26" x2="32.94" y2="40.96" />
        <line x1="26.18" y1="35.26" x2="27.06" y2="40.96" />
        <line x1="26.18" y1="35.26" x2="20.49" y2="36.19" />
        <line x1="23.82" y1="27.99" x2="18.67" y2="30.60" />
        <line x1="23.82" y1="27.99" x2="21.18" y2="22.86" />
        <line x1="43.58" y1="19.41" x2="47.21" y2="30.59" />
        <line x1="44.27" y1="39.64" x2="34.76" y2="46.55" />
        <line x1="25.24" y1="46.55" x2="15.73" y2="39.64" />
        <line x1="12.79" y1="30.60" x2="16.42" y2="19.41" />
        <line x1="24.12" y1="13.82" x2="35.88" y2="13.82" />
      </g>
      <g fill="#f4e9d4">
        <polygon points="30,23.5 36.18,27.99 33.82,35.26 26.18,35.26 23.82,27.99" />
        <polygon points="41.76,13.82 43.58,19.41 38.82,22.86 34.06,19.41 35.88,13.82" />
        <polygon points="49.03,36.18 44.27,39.64 39.51,36.18 41.33,30.59 47.21,30.59" />
        <polygon points="30,50 25.24,46.55 27.06,40.96 32.94,40.96 34.76,46.55" />
        <polygon points="10.97,36.19 12.79,30.60 18.67,30.60 20.49,36.19 15.73,39.64" />
        <polygon points="18.24,13.82 24.12,13.82 25.94,19.41 21.18,22.86 16.42,19.41" />
      </g>
    </svg>
  );
}

export function RollingDivider({ variant = "dark" }: RollingDividerProps) {
  const cls = `rolling-divider${variant === "light" ? " rolling-divider--light" : ""}`;
  return (
    <div className={cls} aria-hidden="true">
      <div className="rd-line" />
      <div className="rd-ball">{variant === "light" ? <DarkBall /> : <LightBall />}</div>
    </div>
  );
}
