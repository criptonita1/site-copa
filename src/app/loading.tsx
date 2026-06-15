"use client";

import { LangProvider, useT } from "@/i18n/LangProvider";

/**
 * Skeleton mínimo enquanto a página principal carrega.
 * Em SSG isso quase nunca aparece, mas é defensivo pro client navigation.
 */
function LoadingContent() {
  const { t } = useT();
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        style={{
          fontFamily: "var(--font-bungee), Bungee, sans-serif",
          fontSize: 14,
          letterSpacing: ".1em",
          color: "var(--ink-dim)",
        }}
      >
        {t("loading.text")}
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <LangProvider>
      <LoadingContent />
    </LangProvider>
  );
}
