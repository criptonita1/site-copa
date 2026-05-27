"use client";

/**
 * Error boundary do App Router. Pega exceções no render do client.
 * Mantém branding mínimo + botão pra tentar de novo.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof console !== "undefined") {
    console.error("[app-error]", error.message);
  }
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 22px",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".18em",
            color: "var(--ink-dim)",
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          ★ Bola na trave
        </div>
        <h1
          style={{
            fontFamily: "var(--font-anton), Anton, sans-serif",
            fontSize: "clamp(48px, 10vw, 110px)",
            lineHeight: 0.86,
            textTransform: "uppercase",
            color: "var(--red-dark)",
          }}
        >
          DEU RUIM
        </h1>
        <p style={{ maxWidth: 420, margin: "20px auto 28px", color: "var(--ink-soft)" }}>
          Aconteceu um erro inesperado por aqui. Tenta de novo — se persistir, é com a gente.
        </p>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 22px",
            background: "var(--amarelo)",
            color: "var(--ink)",
            fontFamily: "var(--font-bungee), Bungee, sans-serif",
            fontSize: 13,
            letterSpacing: ".06em",
            border: "2px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--ink)",
            cursor: "pointer",
          }}
        >
          TENTAR DE NOVO
        </button>
      </div>
    </main>
  );
}
