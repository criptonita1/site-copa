import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 22px", textAlign: "center" }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: ".18em", color: "var(--ink-dim)", marginBottom: 14, textTransform: "uppercase" }}>
          ★ Saiu pra cobrar escanteio
        </div>
        <h1 style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(60px, 14vw, 160px)", lineHeight: 0.86, textTransform: "uppercase", color: "var(--verde-deep)" }}>
          404
        </h1>
        <p style={{ maxWidth: 420, margin: "20px auto 28px", color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.5 }}>
          Essa página não tá no jogo. Mas a Copa começa em breve — bora ver onde passa cada partida?
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 22px",
            background: "var(--ink)",
            color: "var(--amarelo)",
            fontFamily: "var(--font-bungee), Bungee, sans-serif",
            fontSize: 13,
            letterSpacing: ".06em",
            border: "2px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--verde)",
          }}
        >
          VOLTAR PRA HOME
        </Link>
      </div>
    </main>
  );
}
