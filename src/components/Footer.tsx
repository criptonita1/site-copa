"use client";

import { APP } from "@/config";
import { StarSvg } from "@/components/icons";
import { SupportBlock } from "@/components/SupportBlock";
import { useT } from "@/i18n/LangProvider";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="foot">
      <div className="wrap">
        <SupportBlock />
        <div className="foot-grid">
          <div>
            <div className="stars-5" aria-label={t("footer.starsAria")}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarSvg key={i} />
              ))}
              <span className="label">{t("footer.penta")}</span>
            </div>
            <div className="foot-mark">
              {t("brand.pre")} <em>{t("brand.cup")}!</em>
            </div>
          </div>
          <div className="foot-meta">
            {t("footer.madeBy")}{" "}
            <a
              href={APP.AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>{APP.AUTHOR_NAME.toUpperCase()}</b>
            </a>
            <br />
            {t("footer.meta")}
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            {t("footer.disclaimer")}
            <a
              href="/privacidade"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {t("footer.privacy")}
            </a>
          </span>
          <span>{APP.HASHTAG}</span>
        </div>
      </div>
    </footer>
  );
}
