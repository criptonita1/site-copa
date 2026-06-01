import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Bungee, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { APP } from "@/config";
import { CHANNELS } from "@/data/channels";
import { MATCHES } from "@/lib/matches";
import "@/styles/globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-archivo",
});
const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bungee",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP.SITE_URL),
  title: {
    default: `${APP.SITE_NAME} — ${APP.SITE_TAGLINE}`,
    template: `%s · ${APP.SITE_NAME}`,
  },
  description: APP.SITE_DESCRIPTION,
  applicationName: APP.SITE_NAME,
  keywords: [
    "Copa do Mundo 2026",
    "Onde assistir Copa",
    "Brasil Copa 2026",
    "Globo Copa",
    "SBT Copa",
    "CazéTV",
    "SporTV",
    "Calendário Copa 2026",
  ],
  authors: [{ name: APP.AUTHOR_NAME, url: APP.AUTHOR_URL }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: APP.SITE_NAME,
    title: `${APP.SITE_NAME} — ${APP.SITE_TAGLINE}`,
    description: APP.SITE_DESCRIPTION,
    url: APP.SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: APP.SITE_NAME,
    description: APP.SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4e9d4",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD Schema.org SportsEvent + BroadcastEvent (rich result "onde assistir")
function buildJsonLd() {
  return MATCHES.map((m) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${m.mandante} vs ${m.visitante}`,
    sport: "Football",
    startDate: m.kickoffUTC,
    location: {
      "@type": "Place",
      name: m.estadio,
      address: `${m.cidade}, ${m.pais}`,
    },
    competitor: [
      { "@type": "SportsTeam", name: m.mandante },
      { "@type": "SportsTeam", name: m.visitante },
    ],
    eventStatus: "https://schema.org/EventScheduled",
    superEvent: {
      "@type": "SportsEvent",
      name: "Copa do Mundo FIFA 2026",
    },
    // BroadcastEvent por canal — alimenta o rich result do Google "Onde assistir"
    subEvent: m.canais
      .map((c) => CHANNELS[c])
      .filter(Boolean)
      .map((ch) => ({
        "@type": "BroadcastEvent",
        name: `${m.mandante} vs ${m.visitante} — ${ch.nome}`,
        isLiveBroadcast: true,
        publisher: {
          "@type": "Organization",
          name: ch.nome,
        },
        broadcastOfEvent: {
          "@type": "SportsEvent",
          name: `${m.mandante} vs ${m.visitante}`,
        },
        startDate: m.kickoffUTC,
        videoFormat: ch.delivery === "youtube" ? "HD" : "HD",
      })),
  }));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const variables = [
    anton.variable,
    archivo.variable,
    bungee.variable,
    spaceMono.variable,
  ].join(" ");

  return (
    <html lang="pt-BR" className={variables}>
      <head>
        <script
          type="application/ld+json"
          // escape de `<` previne quebra de parser HTML se algum dia um campo
          // do JSON-LD contiver `</script>` (defesa em profundidade — hoje o
          // conteúdo vem todo de matches.json validado por Zod).
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
