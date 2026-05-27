import { ImageResponse } from "next/og";
import { APP } from "@/config";

export const runtime = "edge";
export const alt = `${APP.SITE_NAME} — ${APP.SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4e9d4",
          display: "flex",
          flexDirection: "column",
          padding: 60,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Faixa bandeira topo */}
        <div style={{ display: "flex", height: 28, width: "100%", position: "absolute", top: 0, left: 0 }}>
          <div style={{ flex: 1, background: "#00A045" }} />
          <div style={{ flex: 1, background: "#FFDB2A" }} />
          <div style={{ flex: 1, background: "#1D3FA1" }} />
        </div>

        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            color: "#6b5a3e",
            textTransform: "uppercase",
            marginTop: 40,
          }}
        >
          ★ COPA DO MUNDO · 2026
        </div>

        <div
          style={{
            fontSize: 140,
            color: "#054a23",
            lineHeight: 0.9,
            fontWeight: 900,
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          ONDE VER<br />
          A <span style={{ color: "#1D3FA1" }}>COPA!</span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#2a2a2a",
            marginTop: 24,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {APP.SITE_TAGLINE}. Marca os canais que você tem, o site mostra onde passa cada jogo.
        </div>

        {/* Rodapé */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "space-between",
            color: "#0d0d0d",
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          <span>{APP.SITE_URL.replace(/^https?:\/\//, "")}</span>
          <span style={{ color: "#00A045", fontWeight: 900 }}>{APP.HASHTAG}</span>
        </div>

        {/* Faixa rodapé */}
        <div style={{ display: "flex", height: 14, width: "100%", position: "absolute", bottom: 0, left: 0 }}>
          <div style={{ flex: 1, background: "#00A045" }} />
          <div style={{ flex: 1, background: "#FFDB2A" }} />
          <div style={{ flex: 1, background: "#1D3FA1" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
