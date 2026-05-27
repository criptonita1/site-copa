/**
 * SVGs reutilizáveis — bola, bandeira BR, estrela, arrow.
 */

export function BallSvg({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill="#fff" stroke="#0d0d0d" strokeWidth="2" />
      <polygon points="14,5 18,8 16.5,12.5 11.5,12.5 10,8" fill="#0d0d0d" />
      <polygon points="6,11 9.5,13 8,17 4.5,16" fill="#0d0d0d" />
      <polygon points="22,11 18.5,13 20,17 23.5,16" fill="#0d0d0d" />
      <polygon points="11,18 17,18 18,22.5 14,24 10,22.5" fill="#0d0d0d" />
    </svg>
  );
}

export function FlagBrSvg({
  width = 80,
  height = 56,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 80 56" width={width} height={height} className={className} aria-hidden="true">
      <rect width="80" height="56" fill="#00A045" />
      <polygon points="40,6 74,28 40,50 6,28" fill="#FFDB2A" />
      <circle cx="40" cy="28" r="11" fill="#1D3FA1" />
      <path d="M30 30 Q 40 24 50 30" stroke="#fff" strokeWidth="1.4" fill="none" />
      <circle cx="34" cy="25" r=".9" fill="#fff" />
      <circle cx="40" cy="22.5" r="1.1" fill="#fff" />
      <circle cx="46" cy="25" r=".9" fill="#fff" />
      <circle cx="37" cy="33" r=".7" fill="#fff" />
      <circle cx="44" cy="33" r=".8" fill="#fff" />
      <circle cx="40" cy="29" r=".6" fill="#fff" />
    </svg>
  );
}

export function StarSvg({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <polygon
        points="12,2 14.6,9.2 22,9.2 16,13.8 18.6,21 12,16.4 5.4,21 8,13.8 2,9.2 9.4,9.2"
        fill="currentColor"
        stroke="#0d0d0d"
        strokeWidth=".8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1V11M7 11L3 7M7 11L11 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function DownloadSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1V10M7 10L3 6M7 10L11 6M1 13H13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function LinkSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M5 9L9 5M3 7L1.5 8.5C0.5 9.5 0.5 11 1.5 12C2.5 13 4 13 5 12L6.5 10.5M11 7L12.5 5.5C13.5 4.5 13.5 3 12.5 2C11.5 1 10 1 9 2L7.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function WhatsappSvg({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11.7 11.7 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6A11.9 11.9 0 0 0 12 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5zM12 22a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 1 1 22 12c0 5.5-4.5 10-10 10zm5.4-7.5c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5a9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5.1-.3v-.4l-1-2.5c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.6 1.1 3.1 1.3 3.3.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4l-.2-.1z" />
    </svg>
  );
}
