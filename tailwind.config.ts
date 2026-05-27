import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-dim": "var(--ink-dim)",
        "ink-low": "var(--ink-low)",
        verde: "var(--verde)",
        "verde-dark": "var(--verde-dark)",
        "verde-deep": "var(--verde-deep)",
        amarelo: "var(--amarelo)",
        "amarelo-2": "var(--amarelo-2)",
        "amarelo-dark": "var(--amarelo-dark)",
        azul: "var(--azul)",
        "azul-deep": "var(--azul-deep)",
        red: "var(--red)",
        "red-dark": "var(--red-dark)",
      },
      fontFamily: {
        anton: ["var(--font-anton)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
        bungee: ["var(--font-bungee)", "sans-serif"],
        caveat: ["var(--font-caveat)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
