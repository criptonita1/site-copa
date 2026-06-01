import { ImageResponse } from "next/og";
import { APP } from "@/config";

export const runtime = "nodejs";
export const alt = `${APP.SITE_NAME} — ${APP.SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Failure mode: se algum fetch falhar, fontList vai vazio e voltamos pra sans-serif —
// imagem continua renderizando, só sem identidade tipográfica. Não retornamos vazio.
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
  // Subset reduz peso e raramente bate cache miss no Google.
  const antonText = "CADAJOGODACOPA.";
  const bungeeText = "ONDEVERACOPA";
  const monoText =
    "ondeveracopa.com.brCOPADOMUNDO·2026BRASIL ondevercadajogodacopasemficarperdido";
  const archivoItText = "sem ficar perdido.";

  const fonts = await Promise.allSettled([
    loadGoogleFont("Anton", 400, antonText),
    loadGoogleFont("Bungee", 400, bungeeText),
    loadGoogleFont("Space Mono", 700, monoText),
    loadGoogleFont("Archivo", 900, archivoItText),
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

  // Paleta do site
  const paper = "#f4e9d4";
  const paperShadow = "#ecdfc5";
  const verdeDeep = "#054a23";
  const verde = "#00A045";
  const amarelo = "#FFDB2A";
  const azul = "#1D3FA1";
  const ink = "#0d0d0d";
  const inkDim = "#6b5a3e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: paper,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "SpaceMono, sans-serif",
          color: ink,
        }}
      >
        {/* Faixa bandeira topo (verde/amarelo/azul) */}
        <div style={{ display: "flex", height: 14, width: "100%" }}>
          <div style={{ flex: 1, background: verde }} />
          <div style={{ flex: 1, background: amarelo }} />
          <div style={{ flex: 1, background: azul }} />
        </div>

        {/* Trave de gol — atrás, suave, como elemento decorativo */}
        <div
          style={{
            position: "absolute",
            top: 110,
            right: -40,
            width: 720,
            height: 460,
            display: "flex",
            opacity: 0.55,
          }}
        >
          <svg width="720" height="460" viewBox="0 0 1000 460">
            {/* halo amarelo */}
            <ellipse cx="500" cy="220" rx="280" ry="150" fill={amarelo} opacity="0.35" />
            {/* parede de fundo */}
            <polygon
              points="320,150 680,150 680,300 320,300"
              fill={paperShadow}
              opacity="0.6"
            />
            {/* linhas de perspectiva da rede */}
            <g stroke={ink} strokeWidth="1.2" opacity="0.32" fill="none">
              <line x1="80" y1="70" x2="320" y2="150" />
              <line x1="920" y1="70" x2="680" y2="150" />
              <line x1="80" y1="390" x2="320" y2="300" />
              <line x1="920" y1="390" x2="680" y2="300" />
              {/* malha vertical aproximada */}
              <line x1="320" y1="150" x2="320" y2="300" />
              <line x1="395" y1="150" x2="395" y2="300" />
              <line x1="470" y1="150" x2="470" y2="300" />
              <line x1="545" y1="150" x2="545" y2="300" />
              <line x1="620" y1="150" x2="620" y2="300" />
              <line x1="680" y1="150" x2="680" y2="300" />
              {/* malha horizontal aproximada */}
              <line x1="320" y1="180" x2="680" y2="180" />
              <line x1="320" y1="210" x2="680" y2="210" />
              <line x1="320" y1="240" x2="680" y2="240" />
              <line x1="320" y1="270" x2="680" y2="270" />
            </g>
            {/* travessão superior */}
            <rect
              x="62" y="52" width="876" height="22" rx="2"
              fill="#fbf6e6" stroke={ink} strokeWidth="3.5"
            />
            {/* poste esquerdo */}
            <rect
              x="62" y="52" width="22" height="346" rx="2"
              fill="#fbf6e6" stroke={ink} strokeWidth="3.5"
            />
            {/* poste direito */}
            <rect
              x="916" y="52" width="22" height="346" rx="2"
              fill="#fbf6e6" stroke={ink} strokeWidth="3.5"
            />
            {/* parafusos */}
            <circle cx="73" cy="63" r="3.5" fill={ink} />
            <circle cx="927" cy="63" r="3.5" fill={ink} />
          </svg>
        </div>

        {/* Conteúdo principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "48px 70px 0 70px",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Linha topo: brand stamp + bandeirinha */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Bungee, sans-serif",
                fontSize: 22,
                color: verdeDeep,
                border: `2.5px solid ${ink}`,
                background: paper,
                padding: "10px 18px",
                letterSpacing: 2,
                boxShadow: `4px 4px 0 ${ink}`,
              }}
            >
              ONDE VER A COPA
            </div>

            {/* Bandeira do Brasil estilo cartoon (mesma do Hero) */}
            <div style={{ display: "flex" }}>
              <svg width="220" height="156" viewBox="0 0 280 200">
                {/* mastro */}
                <rect x="6" y="4" width="6" height="196" fill={ink} />
                <circle cx="9" cy="4" r="7" fill={ink} />
                {/* fundo verde */}
                <path
                  d="M12 16 Q 70 4, 150 20 Q 220 32, 270 14 L 270 116 Q 220 132, 150 118 Q 70 104, 12 122 Z"
                  fill={verde}
                  stroke={ink}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* losango amarelo */}
                <polygon
                  points="140,30 232,68 140,106 48,68"
                  fill={amarelo}
                  stroke={ink}
                  strokeWidth="2"
                />
                {/* círculo azul */}
                <ellipse
                  cx="140" cy="68" rx="30" ry="27"
                  fill={azul}
                  stroke={ink}
                  strokeWidth="2"
                />
                {/* faixa branca */}
                <path
                  d="M115 74 Q 140 62, 165 76"
                  stroke="#fff" strokeWidth="3" fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Mono row: COPA DO MUNDO · 2026 · BRASIL */}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 18,
              letterSpacing: 4,
              color: inkDim,
            }}
          >
            COPA DO MUNDO · 2026 · BRASIL
          </div>

          {/* Headline gigante — Anton */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              fontFamily: "Anton, sans-serif",
              fontSize: 114,
              lineHeight: 0.94,
              color: verdeDeep,
              letterSpacing: -1.5,
            }}
          >
            <div style={{ display: "flex" }}>CADA JOGO</div>
            <div style={{ display: "flex" }}>
              <span>DA</span>
              <span style={{ marginLeft: 26, color: azul }}>COPA.</span>
            </div>
          </div>

          {/* Subhead italic */}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontFamily: "Archivo, sans-serif",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 32,
              color: ink,
            }}
          >
            sem ficar perdido.
          </div>
        </div>

        {/* Rodapé: URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 70px 22px 70px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: ink,
              letterSpacing: 3,
            }}
          >
            ondeveracopa.com.br
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: inkDim,
              letterSpacing: 3,
            }}
          >
            GLOBO · SBT · CAZÉTV · SPORTV · GLOBOPLAY
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
