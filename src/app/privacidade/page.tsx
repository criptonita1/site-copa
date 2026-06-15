import type { Metadata } from "next";
import { APP } from "@/config";
import { LangProvider } from "@/i18n/LangProvider";
import { PrivacyDoc } from "./PrivacyDoc";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Onde Ver a Copa trata seu email e dados de navegação. Conforme LGPD.",
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <LangProvider>
      <PrivacyDoc
        siteName={APP.SITE_NAME}
        authorName={APP.AUTHOR_NAME}
        authorUrl={APP.AUTHOR_URL}
      />
    </LangProvider>
  );
}
