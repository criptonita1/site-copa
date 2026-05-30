"use client";

import { useState } from "react";

export function EmailCapture() {
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — bot preenche

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state !== "idle") return;
    setState("loading");
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
          <div className="email-copy">
            <h3>
              UM LEMBRETE <em>antes</em> DE CADA JOGO DO BRASIL.
            </h3>
            <p>
              Manda 2 horas antes, com canal e horário no seu fuso. Sem spam, só
              lembrete antes do jogo. Sem firula.
            </p>
            <p
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              Ao se inscrever, você concorda com a nossa{" "}
              <a
                href="/privacidade"
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                política de privacidade
              </a>
              . Cancela quando quiser.
            </p>
          </div>
          <form
            className={`email-form${state === "ok" ? " ok" : ""}`}
            onSubmit={onSubmit}
          >
            {state === "ok" ? (
              <span className="done">★ TÁ ANOTADO! CHEGA ANTES DO 1º TOQUE</span>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com — sem zoeira"
                  aria-label="Email"
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
                  {state === "loading" ? "..." : "ME AVISA"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
