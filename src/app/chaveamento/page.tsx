import type { Metadata } from "next";
import Link from "next/link";
import { APP } from "@/config";
import { Bracket } from "@/components/Bracket";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chaveamento da Copa 2026 — Caminho até a final",
  description:
    "Acompanhe o chaveamento do mata-mata da Copa 2026 — 32-avos, oitavas, quartas, semifinais e final. Atualizado a cada jogo, com a trilha do Brasil em destaque.",
  alternates: { canonical: `${APP.SITE_URL}/chaveamento` },
  openGraph: {
    title: "Chaveamento da Copa 2026",
    description: "Caminho do mata-mata até a grande final, atualizado a cada jogo.",
    url: `${APP.SITE_URL}/chaveamento`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ChaveamentoPage() {
  return (
    <div className="page-shell">
      {/* Mini-nav (sem fuso, link de volta) */}
      <nav className="nav">
        <Link href="/" className="mark" aria-label={APP.SITE_NAME}>
          <span className="word">
            ONDE VER A <span>COPA</span>
            <i>!</i>
          </span>
        </Link>
        <div className="nav-right">
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-dim)",
              border: "1.5px solid var(--ink-low)",
              padding: "7px 12px",
              textDecoration: "none",
            }}
          >
            ← Voltar pra grade
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header
        style={{
          background: "var(--amarelo)",
          borderBottom: "3px solid var(--ink)",
          padding: "32px 0 28px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 22px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
              paddingBottom: 10,
              borderBottom: "1.5px dashed var(--ink-soft)",
              display: "inline-block",
              marginBottom: 12,
            }}
          >
            Copa 2026 · Mata-mata · 32 seleções
          </span>
          <h1
            style={{
              fontFamily: "var(--font-anton), Anton, sans-serif",
              fontSize: "clamp(44px, 10vw, 96px)",
              lineHeight: 0.86,
              textTransform: "uppercase",
              color: "var(--verde-deep)",
              margin: 0,
            }}
          >
            O Chaveamento
          </h1>
          <p
            style={{
              maxWidth: 560,
              color: "var(--ink-soft)",
              fontSize: 14.5,
              marginTop: 14,
              borderLeft: "3px solid var(--ink)",
              paddingLeft: 14,
              lineHeight: 1.5,
            }}
          >
            Dos 16-avos até a final. A chave se completa sozinha conforme os
            jogos vão rolando. Arrasta lateralmente entre as fases e segue a
            trilha do Brasil até o hexa.
          </p>
        </div>
      </header>

      {/* Bracket */}
      <main>
        <Bracket />
      </main>

      <Footer />
    </div>
  );
}
