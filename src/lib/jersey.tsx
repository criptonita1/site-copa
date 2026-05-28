/**
 * Camisas SVG por seleção — porte do mockup, agora como componente tipado.
 */

import { TEAMS, TEAM_TBD, type TeamJersey } from "@/data/teams";

export function getJersey(team: string): TeamJersey {
  if (team === "A definir") return TEAM_TBD;
  return TEAMS[team] ?? { ...TEAM_TBD, num: team.slice(0, 3).toUpperCase() };
}

export function teamAbbr(team: string): string {
  return getJersey(team).abbr ?? team.slice(0, 3).toUpperCase();
}

export interface JerseyProps {
  team: string;
  size?: number;
  className?: string;
}

export function Jersey({ team, size = 54, className }: JerseyProps) {
  const j = getJersey(team);
  const idSafe = team.replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `ch-${idSafe}`;

  const ariaLabel =
    team === "A definir"
      ? "Camisa de seleção a definir"
      : `Camisa da seleção do ${team}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {j.checker && (
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="3" height="3" fill={j.accent} />
            <rect x="3" y="3" width="3" height="3" fill={j.accent} />
          </pattern>
        </defs>
      )}
      <path
        d="M14 20 L8 14 L18 6 L24 10 Q32 14 40 10 L46 6 L56 14 L50 20 L50 56 L14 56 Z"
        fill={j.body}
        stroke="#0d0d0d"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {j.stripe && (
        <>
          {[14, 22, 30, 38, 46].map((x) => (
            <rect key={x} x={x} y="20" width="4" height="36" fill={j.accent} />
          ))}
        </>
      )}
      {j.checker && (
        <rect x="10" y="20" width="44" height="36" fill={`url(#${patternId})`} opacity={0.8} />
      )}
      {/* collar */}
      <path
        d="M24 10 Q32 16 40 10 L36 14 Q32 18 28 14 Z"
        fill={j.accent}
        stroke="#0d0d0d"
        strokeWidth="1.6"
      />
      {/* abbr da seleção (substituindo o número da camisa que confundia com placar) */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="var(--font-mono), 'Space Mono', monospace"
        fontSize="10"
        fill="#0d0d0d"
        fontWeight={700}
        letterSpacing="0.5"
      >
        {j.abbr ?? ""}
      </text>
    </svg>
  );
}
