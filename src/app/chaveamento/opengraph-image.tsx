import { ImageResponse } from "next/og";

// OG dedicado do /chaveamento — antes caía na imagem estática da home.
// Card próprio (bracket/mata-mata) pra quem compartilha o chaveamento no zap.
export const runtime = "edge";
export const alt = "Chaveamento da Copa 2026 — caminho até a final";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFDB2A",
          padding: "60px 72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            color: "#2a2a2a",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Copa 2026 · Mata-mata · 32 seleções
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 112,
            lineHeight: 1,
            fontWeight: 900,
            color: "#054a23",
            textTransform: "uppercase",
            letterSpacing: -2,
          }}
        >
          O Chaveamento
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 30,
            color: "#1a1a1a",
            fontWeight: 600,
            maxWidth: 880,
            lineHeight: 1.3,
          }}
        >
          Dos 16-avos de final à decisão. A chave se completa a cada jogo — com
          a trilha do Brasil em destaque.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#00A045",
              color: "#f4e9d4",
              fontSize: 27,
              fontWeight: 800,
              padding: "14px 22px",
              border: "3px solid #0d0d0d",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Brasil classificado pro mata-mata
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#0d0d0d",
            }}
          >
            ondeveracopa.com.br
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
          }}
        >
          <div style={{ display: "flex", flex: 1, background: "#00A045" }} />
          <div style={{ display: "flex", flex: 1, background: "#FFDB2A" }} />
          <div style={{ display: "flex", flex: 1, background: "#1D3FA1" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
