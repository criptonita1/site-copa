/**
 * Skeleton mínimo enquanto a página principal carrega.
 * Em SSG isso quase nunca aparece, mas é defensivo pro client navigation.
 */
export default function Loading() {
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
        ⚽ CARREGANDO A COPA…
      </div>
    </main>
  );
}
