import type { Metadata } from "next";
import { APP } from "@/config";
import { LangProvider } from "@/i18n/LangProvider";
import { ChaveamentoView } from "@/components/ChaveamentoView";

export const metadata: Metadata = {
  title: "Chaveamento da Copa 2026 — Caminho até a final",
  description:
    "O chaveamento do mata-mata da Copa 2026 — 16-avos de final, oitavas, quartas, semifinais e final. A chave se completa a cada jogo, com a trilha do Brasil em destaque.",
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
      <ChaveamentoView />
    </LangProvider>
  );
}
