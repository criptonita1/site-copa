import type { Metadata } from "next";
import Link from "next/link";
import { APP } from "@/config";
import { Bracket } from "@/components/Bracket";
import { Footer } from "@/components/Footer";
import { LangProvider } from "@/i18n/LangProvider";

export const metadata: Metadata = {
  title: "Chaveamento da Copa 2026 — Caminho até a final",
  description:
    "O chaveamento do mata-mata da Copa 2026 — 32-avos, oitavas, quartas, semifinais e final. A chave se completa a cada jogo, com a trilha do Brasil em destaque.",
  alternates: { canonical: `${APP.SITE_URL}/chaveamento` },
  openGraph: {
    title: "Chaveamento da Copa 2026",
    description:
      "Caminho do mata-mata até a grande final, atualizado a cada jogo.",
    url: `${APP.SITE_URL}/chaveamento`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ChaveamentoPage() {
  return (
    <LangProvider>
      <div className="page-shell">
        {/* Mini-nav: marca + volta pra grade */}
        <nav className="nav">
          <Link href="/" className="mark" aria-label={APP.SITE_NAME}>
            <span className="word">
              ONDE VER A <span>COPA</span>
              <i>!</i>
            </span>
          </Link>
          <div className="nav-right">
            <Link href="/" className="ko-back">
              ← Voltar pra grade
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="ko-header">
          <div className="wrap">
            <span className="ko-eyebrow">Copa 2026 · Mata-mata · 32 seleções</span>
            <h1 className="ko-title">O Chaveamento</h1>
            <p className="ko-intro">
              Dos 32-avos até a final. A chave se completa sozinha conforme os
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
    </LangProvider>
  );
}
