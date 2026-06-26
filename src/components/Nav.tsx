"use client";

import Link from "next/link";
import { APP, TIMEZONES, type TimezoneOffset } from "@/config";
import { BallSvg, FlagBrSvg } from "@/components/icons";
import { useT } from "@/i18n/LangProvider";

interface NavProps {
  tzOffset: TimezoneOffset;
  onTzChange: (offset: TimezoneOffset) => void;
}

export function Nav({ tzOffset, onTzChange }: NavProps) {
  const { t, lang, setLang } = useT();
  return (
    <nav className="nav">
      <a href="#" className="mark" aria-label={APP.SITE_NAME}>
        <span className="ball" aria-hidden="true">
          <BallSvg />
        </span>
        <span className="word">
          {t("brand.pre")} <span>{t("brand.cup")}</span>
          <i>!</i>
        </span>
        <FlagBrSvg className="flag-pin" />
      </a>
      <div className="nav-right">
        <Link href="/chaveamento" className="nav-bracket">
          {t("nav.bracket")}
        </Link>
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
        <select
          className="tz-select"
          aria-label={t("nav.tz")}
          value={tzOffset}
          onChange={(e) => onTzChange(Number(e.target.value) as TimezoneOffset)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.offset} value={tz.offset}>
              {tz.code} · {tz.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
