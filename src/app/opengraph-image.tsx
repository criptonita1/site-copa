import { ImageResponse } from "next/og";
import { APP } from "@/config";

export const runtime = "nodejs";
export const alt = `${APP.SITE_NAME} — ${APP.SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Carrega TTF do Google Fonts via parse do CSS oficial.
// Failure mode: se algum fetch falhar, voltamos pra sans-serif no fontFamily — imagem
// continua renderizando, só sem identidade tipográfica. Não retornamos vazio.
async function loadGoogleFont(family: string, weight: number, text?: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
  const css = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\((https:[^)]+?\.ttf)\)/)?.[1];
  if (!url) throw new Error(`font url not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OG() {
  // Subset com glifos usados pra reduzir peso e bater no cache do Google.
  const headlineText = "ONDE VER A COPA!BRASIL2026";
  const stampText = "EDIÇÃO ESPECIALCOPADOMUNDO·2026Nº01";
  const monoText =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.#·";

  const fonts = await Promise.allSettled([
    loadGoogleFont("Anton", 400, headlineText),
    loadGoogleFont("Bungee", 400, stampText),
    loadGoogleFont("Space Mono", 700, monoText),
    loadGoogleFont("Archivo", 900, "joga"),
  ]);

  const [anton, bungee, mono, archivo] = fonts.map((f) =>
    f.status === "fulfilled" ? f.value : null,
  );

  const fontList: Array<{
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700 | 900;
    style: "normal" | "italic";
  }> = [];
  if (anton) fontList.push({ name: "Anton", data: anton, weight: 400, style: "normal" });
  if (bungee) fontList.push({ name: "Bungee", data: bungee, weight: 400, style: "normal" });
  if (mono) fontList.push({ name: "SpaceMono", data: mono, weight: 700, style: "normal" });
  if (archivo) fontList.push({ name: "Archivo", data: archivo, weight: 900, style: "italic" });

  const paper = "#f4e9d4";
  const amarelo = "#FFDB2A";
  const verdeDeep = "#054a23";
  const verde = "#00A045";
  const azul = "#1D3FA1";
  const ink = "#0d0d0d";
  const inkDim = "#6b5a3e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: amarelo,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "SpaceMono, sans-serif",
          color: ink,
        }}
      >
        {/* Faixa bandeira topo (verde/amarelo/azul) */}
        <div style={{ display: "flex", height: 18, width: "100%" }}>
          <div style={{ flex: 1, background: verde }} />
          <div style={{ flex: 1, background: amarelo }} />
          <div style={{ flex: 1, background: azul }} />
        </div>

        {/* Conteúdo principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "44px 60px 0 60px",
            flex: 1,
          }}
        >
          {/* Tag row topo: stamp + edição */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `2px dashed ${ink}`,
              paddingBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Bungee, sans-serif",
                  fontSize: 20,
                  border: `2px solid ${ink}`,
                  background: paper,
                  padding: "6px 14px",
                  letterSpacing: 2,
                }}
              >
                EDIÇÃO ESPECIAL
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  letterSpacing: 3,
                  color: ink,
                  marginLeft: 18,
                }}
              >
                COPA DO MUNDO · 2026
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontStyle: "italic",
                fontFamily: "Archivo, sans-serif",
                color: azul,
              }}
            >
              edição do torcedor — Nº 01
            </div>
          </div>

          {/* Headline gigante estilo Anton */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontFamily: "Anton, sans-serif",
              fontSize: 170,
              lineHeight: 0.88,
              color: verdeDeep,
              letterSpacing: -2,
            }}
          >
            <div style={{ display: "flex" }}>ONDE VER</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
              <span>A</span>
              <span style={{ color: azul }}>COPA!</span>
            </div>
          </div>

          {/* Tagline — fica logo abaixo do headline */}
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontFamily: "Archivo, sans-serif",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 26,
              color: ink,
              maxWidth: 1000,
            }}
          >
            marca os canais que você tem — o site mostra onde passa cada jogo.
          </div>
        </div>

        {/* Rodapé: URL + hashtag */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 60px 22px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: inkDim,
              letterSpacing: 2,
            }}
          >
            ondeveracopa.com.br
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Bungee, sans-serif",
              fontSize: 32,
              color: verdeDeep,
              letterSpacing: 2,
            }}
          >
            #COPA26
          </div>
        </div>

        {/* Faixa bandeira rodapé */}
        <div style={{ display: "flex", height: 14, width: "100%" }}>
          <div style={{ flex: 1, background: verde }} />
          <div style={{ flex: 1, background: amarelo }} />
          <div style={{ flex: 1, background: azul }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontList.length > 0 ? fontList : undefined,
    },
  );
}
