"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS, interpolate, type Lang } from "@/i18n/dict";

const STORAGE_KEY = "ovc-lang";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const Ctx = createContext<LangCtx | null>(null);

/**
 * Idioma do site (pt/en). SSR e 1º render = "pt" (estável, evita mismatch);
 * no client, lê localStorage ou detecta navigator.language e ajusta no efeito.
 */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    // Default é SEMPRE PT (site brasileiro). Só vai pra EN se a pessoa
    // tiver escolhido EN antes (salvo no localStorage). Sem auto-detecção
    // por idioma do navegador.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored === "en") setLangState("en");
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const s = STRINGS[lang][key] ?? STRINGS.pt[key] ?? key;
      return interpolate(s, params);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Fallback defensivo: fora do provider, devolve PT cru.
    return {
      lang: "pt",
      setLang: () => {},
      t: (key, params) => interpolate(STRINGS.pt[key] ?? key, params),
    };
  }
  return ctx;
}
