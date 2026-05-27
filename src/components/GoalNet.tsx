/**
 * Trave de gol ilustrada (peça 02 do claude design).
 * Trapézio de fuga (frente grande → fundo menor), 3 painéis de rede em
 * perspectiva, halo amarelo radial atrás. Vai atrás do countdown no hero.
 * Some no mobile (<880px).
 */

export function GoalNet({ className }: { className?: string }) {
  return (
    <svg
      className={`goal-net${className ? " " + className : ""}`}
      viewBox="0 0 1000 460"
      aria-hidden="true"
    >
      <defs>
        <pattern id="net" x="0" y="0" width="34" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M17 0 L34 12 L17 24 L0 12 Z"
            fill="none"
            stroke="#0d0d0d"
            strokeWidth=".9"
            strokeLinejoin="round"
          />
        </pattern>
        <radialGradient id="goal-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="40%" stopColor="#fff3a0" stopOpacity=".55" />
          <stop offset="100%" stopColor="#ffdb2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* parede de fundo da trave */}
      <polygon points="320,150 680,150 680,300 320,300" fill="#ffe24a" opacity=".5" />
      {/* refletor radial dentro */}
      <ellipse cx="500" cy="220" rx="240" ry="120" fill="url(#goal-glow)" />
      {/* rede traseira */}
      <polygon points="320,150 680,150 680,300 320,300" fill="url(#net)" />
      {/* painel superior da rede (perspectiva) */}
      <polygon points="80,70 920,70 680,150 320,150" fill="url(#net)" opacity=".55" />
      {/* painel esquerdo da rede */}
      <polygon points="80,70 320,150 320,300 80,390" fill="url(#net)" opacity=".55" />
      {/* painel direito da rede */}
      <polygon points="920,70 680,150 680,300 920,390" fill="url(#net)" opacity=".55" />

      {/* linhas de perspectiva */}
      <g stroke="#0d0d0d" strokeWidth="1.2" opacity=".35" fill="none">
        <line x1="80" y1="70" x2="320" y2="150" />
        <line x1="920" y1="70" x2="680" y2="150" />
        <line x1="80" y1="390" x2="320" y2="300" />
        <line x1="920" y1="390" x2="680" y2="300" />
      </g>

      {/* travessão superior */}
      <rect
        x="62"
        y="52"
        width="876"
        height="22"
        rx="2"
        fill="#fbf6e6"
        stroke="#0d0d0d"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="68" y="55" width="864" height="4" fill="#fff" opacity=".7" />
      {/* poste esquerdo */}
      <rect
        x="62"
        y="52"
        width="22"
        height="346"
        rx="2"
        fill="#fbf6e6"
        stroke="#0d0d0d"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="65" y="58" width="4" height="335" fill="#fff" opacity=".7" />
      {/* poste direito */}
      <rect
        x="916"
        y="52"
        width="22"
        height="346"
        rx="2"
        fill="#fbf6e6"
        stroke="#0d0d0d"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x="919" y="58" width="4" height="335" fill="#fff" opacity=".7" />

      {/* parafusos */}
      <circle cx="73" cy="63" r="3.5" fill="#0d0d0d" />
      <circle cx="927" cy="63" r="3.5" fill="#0d0d0d" />

      {/* sombras no chão */}
      <ellipse cx="73" cy="404" rx="26" ry="4" fill="#0d0d0d" opacity=".28" />
      <ellipse cx="927" cy="404" rx="26" ry="4" fill="#0d0d0d" opacity=".28" />
    </svg>
  );
}
