/**
 * Fundo de gramado vertical (peça 03 do claude design).
 * 800×1400 com listras horizontais — combina com scroll vertical.
 * Marcações de áreas no topo/baixo + círculo central no meio.
 * Aplicado em opacidade 8.5% com mix-blend-mode multiply.
 */

export function FieldBg() {
  return (
    <svg
      className="field-bg"
      viewBox="0 0 800 1400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="mow" x="0" y="0" width="800" height="160" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="800" height="80" fill="#054a23" />
          <rect x="0" y="80" width="800" height="80" fill="#007a30" />
        </pattern>
      </defs>
      <rect width="800" height="1400" fill="url(#mow)" />

      <g fill="none" stroke="#f4e9d4" strokeWidth="3.5" strokeLinejoin="round">
        {/* área superior */}
        <rect x="180" y="0" width="440" height="180" />
        <rect x="300" y="0" width="200" height="60" />
        <circle cx="400" cy="0" r="8" fill="#f4e9d4" />
        <circle cx="400" cy="120" r="4" fill="#f4e9d4" />
        <path d="M340 180 A 60 60 0 0 0 460 180" />

        {/* meio campo */}
        <line x1="0" y1="700" x2="800" y2="700" />
        <circle cx="400" cy="700" r="120" />
        <circle cx="400" cy="700" r="5" fill="#f4e9d4" />

        {/* área inferior */}
        <rect x="180" y="1220" width="440" height="180" />
        <rect x="300" y="1340" width="200" height="60" />
        <circle cx="400" cy="1400" r="8" fill="#f4e9d4" />
        <circle cx="400" cy="1280" r="4" fill="#f4e9d4" />
        <path d="M340 1220 A 60 60 0 0 1 460 1220" />

        {/* cantos (corner arcs) */}
        <path d="M0 0 A 22 22 0 0 1 22 22" />
        <path d="M800 0 A 22 22 0 0 0 778 22" />
        <path d="M0 1400 A 22 22 0 0 0 22 1378" />
        <path d="M800 1400 A 22 22 0 0 1 778 1378" />
      </g>
    </svg>
  );
}
