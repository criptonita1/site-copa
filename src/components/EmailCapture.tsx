"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useT } from "@/i18n/LangProvider";

export function EmailCapture() {
  const { t, lang } = useT();
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — bot preenche

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state !== "idle") return;
    setState("loading");
    // Track sem o email (LGPD — só contar evento, sem identificar)
    track("email_submit_attempt");
    try {
      await fetch("/api/lembrete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
    } catch {
      /* silencioso — UX otimista mesmo se falhar */
    } finally {
      setState("ok");
    }
  }

  return (
    <section className="email-section">
      <div className="wrap">
        <div className="email-inner">
          <span className="email-tag">{t("email.tag")}</span>
          <div className="email-copy">
            <h3>
              {t("email.h3a")} <em>{t("email.h3em")}</em> {t("email.h3b")}
            </h3>
            <p>{t("email.desc")}</p>
            <p
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              {(() => {
                const legal = t("email.legal");
                const phrase =
                  lang === "en" ? "privacy policy" : "política de privacidade";
                const idx = legal.indexOf(phrase);
                if (idx === -1) return legal;
                return (
                  <>
                    {legal.slice(0, idx)}
                    <a
                      href="/privacidade"
                      style={{ textDecoration: "underline", color: "inherit" }}
                    >
                      {phrase}
                    </a>
                    {legal.slice(idx + phrase.length)}
                  </>
                );
              })()}
            </p>
          </div>
          <form
            className={`email-form${state === "ok" ? " ok" : ""}`}
            onSubmit={onSubmit}
          >
            {state === "ok" ? (
              <span className="done">{t("email.success")}</span>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder={t("email.placeholder")}
                  aria-label={t("email.aria")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  autoComplete="email"
                  disabled={state === "loading"}
                />
                {/* Honeypot — bots preenchem qualquer input visible */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{ position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />
                <button type="submit" disabled={state === "loading"}>
                  {state === "loading" ? "..." : t("email.submit")}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
