"use client";

import Link from "next/link";
import { APP } from "@/config";
import { Bracket } from "@/components/Bracket";
import { Footer } from "@/components/Footer";
import { useT } from "@/i18n/LangProvider";

/** Conteúdo client da /chaveamento — bilíngue (toggle PT/EN no topo). */
export function ChaveamentoView() {
  const { t, lang, setLang } = useT();

  return (
    <div className="page-shell">
      <nav className="nav">
        <Link href="/" className="mark" aria-label={APP.SITE_NAME}>
          <span className="word">
            ONDE VER A <span>COPA</span>
            <i>!</i>
          </span>
        </Link>
        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label={t("nav.lang")}>
            <button
              type="button"
              className={lang === "pt" ? "active" : ""}
              aria-pressed={lang === "pt"}
              onClick={() => setLang("pt")}
            >
              PT
            </button>
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              aria-pressed={lang === "en"}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          <Link href="/" className="ko-back">
            {t("bracket.back")}
          </Link>
        </div>
      </nav>

      <header className="ko-header">
        <div className="wrap">
          <span className="ko-eyebrow">{t("bracket.eyebrow")}</span>
          <h1 className="ko-title">{t("bracket.title")}</h1>
          <p className="ko-intro">{t("bracket.intro")}</p>
        </div>
      </header>

      <main>
        <Bracket />
      </main>

      <Footer />
    </div>
  );
}
