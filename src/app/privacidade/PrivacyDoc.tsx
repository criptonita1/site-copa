"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useT } from "@/i18n/LangProvider";
import type { Lang } from "@/i18n/dict";

const CONTACT_EMAIL = "info@modularcrypto.xyz";

type Vars = {
  siteName: string;
  authorName: string;
  authorUrl: string;
  contactEmail: string;
};

type Copy = {
  title: string;
  lastUpdate: string;
  lastUpdateLabel: string;
  backHome: string;
  sections: { title: string; body: (v: Vars) => ReactNode }[];
};

const COPY: Record<Lang, Copy> = {
  pt: {
    title: "Política de Privacidade",
    lastUpdate: "29 de maio de 2026",
    lastUpdateLabel: "Última atualização",
    backHome: "← VOLTAR PRA HOME",
    sections: [
      {
        title: "1. Quem somos",
        body: (v) => (
          <>
            <p>
              O <strong>{v.siteName}</strong> é um site informativo gratuito,
              mantido por <strong>{v.authorName}</strong>, que indica em quais
              canais cada jogo da Copa 2026 será transmitido no Brasil.
            </p>
            <p>
              Não somos afiliados à FIFA, às emissoras de TV, aos serviços de
              streaming ou às seleções nacionais. Todas as marcas mencionadas
              pertencem aos seus respectivos titulares.
            </p>
          </>
        ),
      },
      {
        title: "2. Que dados coletamos",
        body: () => (
          <>
            <p>Coletamos o mínimo necessário pra você usar o site:</p>
            <ul>
              <li>
                <strong>Email</strong> — somente se você inscrever
                voluntariamente no formulário &quot;Me avisa antes do
                jogo&quot;.
              </li>
              <li>
                <strong>Preferências de navegação</strong> — canais marcados,
                fuso horário, filtro &quot;só Brasil&quot;. Ficam só no seu
                navegador (localStorage), não vão pro nosso servidor.
              </li>
              <li>
                <strong>Dados de navegação anônimos</strong> — páginas vistas,
                tempo de visita, país aproximado, dispositivo. Coletados via
                Vercel Analytics, sem cookies e sem identificar você
                pessoalmente.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "3. Pra que usamos",
        body: () => (
          <ul>
            <li>
              <strong>Email:</strong> enviar lembrete antes de cada jogo do
              Brasil — só isso. Sem marketing, sem spam, sem venda de lista.
            </li>
            <li>
              <strong>Dados anônimos:</strong> entender quais conteúdos são
              úteis e melhorar o site.
            </li>
          </ul>
        ),
      },
      {
        title: "4. Base legal (LGPD)",
        body: () => (
          <>
            <p>
              O tratamento do seu email se baseia no seu{" "}
              <strong>consentimento</strong> (LGPD, Art. 7º, inciso I), dado de
              forma livre e informada quando você clica em &quot;Me avisa&quot;.
            </p>
            <p>
              Os dados anônimos de navegação se baseiam em{" "}
              <strong>legítimo interesse</strong> (Art. 7º, inciso IX) pra
              melhorar a experiência.
            </p>
          </>
        ),
      },
      {
        title: "5. Com quem compartilhamos",
        body: () => (
          <>
            <p>
              Pra operar o site, usamos serviços de terceiros que atuam como{" "}
              <strong>operadores</strong> dos seus dados:
            </p>
            <ul>
              <li>
                <strong>Resend</strong> (resend.com) — armazena seu email e
                envia os lembretes. Sediado nos EUA, com cláusulas padrão de
                transferência internacional.
              </li>
              <li>
                <strong>Vercel</strong> (vercel.com) — hospeda o site e fornece
                analytics anônimo.
              </li>
            </ul>
            <p>
              <strong>Nunca vendemos</strong> seu email. Nunca compartilhamos
              com terceiros pra fins de marketing.
            </p>
          </>
        ),
      },
      {
        title: "6. Por quanto tempo guardamos",
        body: () => (
          <>
            <p>Seu email fica salvo até:</p>
            <ul>
              <li>
                Você pedir exclusão (a qualquer momento — ver seção 8); ou
              </li>
              <li>
                O fim do ciclo de uso do site (até 6 meses após o término da
                Copa 2026).
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Seus direitos (LGPD)",
        body: () => (
          <>
            <p>Você tem direito de, a qualquer momento, solicitar:</p>
            <ul>
              <li>Confirmação de que tratamos seus dados</li>
              <li>Acesso aos dados que temos</li>
              <li>Correção de dados incompletos ou incorretos</li>
              <li>Exclusão dos seus dados</li>
              <li>Portabilidade pra outro serviço</li>
              <li>Revogação do consentimento</li>
            </ul>
          </>
        ),
      },
      {
        title: "8. Como exercer seus direitos",
        body: (v) => (
          <>
            <p>
              Mande email pra{" "}
              <a
                href={`mailto:${v.contactEmail}?subject=LGPD%20%E2%80%94%20${encodeURIComponent(v.siteName)}`}
                style={{ color: "var(--verde-deep)", fontWeight: 700 }}
              >
                {v.contactEmail}
              </a>{" "}
              com o assunto &quot;LGPD&quot; e descreva o que você quer
              (excluir, acessar, corrigir, etc).
            </p>
            <p>Respondemos em até 15 dias.</p>
          </>
        ),
      },
      {
        title: "9. Segurança",
        body: () => (
          <p>
            Usamos HTTPS em todo o site, rate-limit no formulário de email pra
            evitar abuso, e nossos operadores (Resend, Vercel) seguem padrões
            internacionais de segurança. Mesmo assim, nenhum sistema é 100%
            seguro — se rolar incidente que possa afetar seus dados, vamos
            comunicar conforme exigido pela LGPD.
          </p>
        ),
      },
      {
        title: "10. Cookies",
        body: () => (
          <p>
            <strong>Não usamos cookies de rastreamento.</strong> O site
            funciona totalmente com armazenamento local do seu navegador
            (localStorage) pra lembrar suas preferências. Vercel Analytics,
            nosso provedor de métricas, é cookieless.
          </p>
        ),
      },
      {
        title: "11. Mudanças nesta política",
        body: () => (
          <p>
            Se mudarmos algo material, atualizamos a data no topo e — se a
            mudança afetar seu consentimento — pedimos sua confirmação de novo.
          </p>
        ),
      },
      {
        title: "12. Contato",
        body: (v) => (
          <>
            <p>
              Qualquer dúvida, pedido ou reclamação:{" "}
              <a
                href={`mailto:${v.contactEmail}`}
                style={{ color: "var(--verde-deep)", fontWeight: 700 }}
              >
                {v.contactEmail}
              </a>
            </p>
            <p>
              Operado por <strong>{v.authorName}</strong> ·{" "}
              <a
                href={v.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--verde-deep)" }}
              >
                {v.authorUrl.replace(/^https?:\/\//, "")}
              </a>
            </p>
          </>
        ),
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdate: "May 29, 2026",
    lastUpdateLabel: "Last updated",
    backHome: "← BACK TO HOME",
    sections: [
      {
        title: "1. Who we are",
        body: (v) => (
          <>
            <p>
              <strong>{v.siteName}</strong> is a free informational website,
              maintained by <strong>{v.authorName}</strong>, that tells you on
              which channels each match of the 2026 World Cup will be broadcast
              in Brazil.
            </p>
            <p>
              We are not affiliated with FIFA, the TV broadcasters, the
              streaming services, or the national teams. All trademarks
              mentioned belong to their respective owners.
            </p>
          </>
        ),
      },
      {
        title: "2. What data we collect",
        body: () => (
          <>
            <p>We collect the bare minimum needed for you to use the site:</p>
            <ul>
              <li>
                <strong>Email</strong> — only if you voluntarily sign up through
                the &quot;Remind me before the match&quot; form.
              </li>
              <li>
                <strong>Browsing preferences</strong> — selected channels, time
                zone, the &quot;Brazil only&quot; filter. These stay only in
                your browser (localStorage); they never reach our server.
              </li>
              <li>
                <strong>Anonymous browsing data</strong> — pages viewed, time on
                site, approximate country, device. Collected via Vercel
                Analytics, without cookies and without identifying you
                personally.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "3. What we use it for",
        body: () => (
          <ul>
            <li>
              <strong>Email:</strong> to send a reminder before each Brazil
              match — that&apos;s all. No marketing, no spam, no selling of
              lists.
            </li>
            <li>
              <strong>Anonymous data:</strong> to understand which content is
              useful and improve the site.
            </li>
          </ul>
        ),
      },
      {
        title: "4. Legal basis (LGPD)",
        body: () => (
          <>
            <p>
              The processing of your email is based on your{" "}
              <strong>consent</strong> (LGPD, Article 7, item I), given freely
              and on an informed basis when you click &quot;Remind me&quot;.
            </p>
            <p>
              The anonymous browsing data relies on{" "}
              <strong>legitimate interest</strong> (Article 7, item IX) to
              improve the experience.
            </p>
          </>
        ),
      },
      {
        title: "5. Who we share it with",
        body: () => (
          <>
            <p>
              To operate the site, we use third-party services that act as{" "}
              <strong>data processors</strong> of your data:
            </p>
            <ul>
              <li>
                <strong>Resend</strong> (resend.com) — stores your email and
                sends the reminders. Based in the USA, under standard
                international transfer clauses.
              </li>
              <li>
                <strong>Vercel</strong> (vercel.com) — hosts the site and
                provides anonymous analytics.
              </li>
            </ul>
            <p>
              We <strong>never sell</strong> your email. We never share it with
              third parties for marketing purposes.
            </p>
          </>
        ),
      },
      {
        title: "6. How long we keep it",
        body: () => (
          <>
            <p>Your email is stored until:</p>
            <ul>
              <li>
                You request deletion (at any time — see section 8); or
              </li>
              <li>
                The end of the site&apos;s usage cycle (up to 6 months after the
                2026 World Cup ends).
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "7. Your rights (LGPD)",
        body: () => (
          <>
            <p>You have the right, at any time, to request:</p>
            <ul>
              <li>Confirmation that we process your data</li>
              <li>Access to the data we hold</li>
              <li>Correction of incomplete or inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Portability to another service</li>
              <li>Withdrawal of consent</li>
            </ul>
          </>
        ),
      },
      {
        title: "8. How to exercise your rights",
        body: (v) => (
          <>
            <p>
              Send an email to{" "}
              <a
                href={`mailto:${v.contactEmail}?subject=LGPD%20%E2%80%94%20${encodeURIComponent(v.siteName)}`}
                style={{ color: "var(--verde-deep)", fontWeight: 700 }}
              >
                {v.contactEmail}
              </a>{" "}
              with the subject &quot;LGPD&quot; and describe what you want
              (delete, access, correct, etc).
            </p>
            <p>We respond within 15 days.</p>
          </>
        ),
      },
      {
        title: "9. Security",
        body: () => (
          <p>
            We use HTTPS across the entire site, rate limiting on the email form
            to prevent abuse, and our data processors (Resend, Vercel) follow
            international security standards. Even so, no system is 100% secure —
            if an incident occurs that could affect your data, we will notify
            you as required by the LGPD.
          </p>
        ),
      },
      {
        title: "10. Cookies",
        body: () => (
          <p>
            <strong>We do not use tracking cookies.</strong> The site works
            entirely with your browser&apos;s local storage (localStorage) to
            remember your preferences. Vercel Analytics, our metrics provider, is
            cookieless.
          </p>
        ),
      },
      {
        title: "11. Changes to this policy",
        body: () => (
          <p>
            If we change anything material, we update the date at the top and —
            if the change affects your consent — we ask for your confirmation
            again.
          </p>
        ),
      },
      {
        title: "12. Contact",
        body: (v) => (
          <>
            <p>
              For any question, request, or complaint:{" "}
              <a
                href={`mailto:${v.contactEmail}`}
                style={{ color: "var(--verde-deep)", fontWeight: 700 }}
              >
                {v.contactEmail}
              </a>
            </p>
            <p>
              Operated by <strong>{v.authorName}</strong> ·{" "}
              <a
                href={v.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--verde-deep)" }}
              >
                {v.authorUrl.replace(/^https?:\/\//, "")}
              </a>
            </p>
          </>
        ),
      },
    ],
  },
};

export function PrivacyDoc({
  siteName,
  authorName,
  authorUrl,
}: {
  siteName: string;
  authorName: string;
  authorUrl: string;
}) {
  const { lang } = useT();
  const copy = COPY[lang];
  const vars: Vars = {
    siteName,
    authorName,
    authorUrl,
    contactEmail: CONTACT_EMAIL,
  };

  return (
    <main
      style={{
        minHeight: "70vh",
        maxWidth: 760,
        margin: "0 auto",
        padding: "60px 22px 80px",
        color: "var(--ink)",
        fontFamily: "var(--font-archivo), system-ui, sans-serif",
        lineHeight: 1.6,
        fontSize: 16,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          letterSpacing: ".18em",
          color: "var(--ink-dim)",
          marginBottom: 14,
          textTransform: "uppercase",
        }}
      >
        ★ {siteName}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-anton), Anton, sans-serif",
          fontSize: "clamp(40px, 8vw, 72px)",
          lineHeight: 0.95,
          textTransform: "uppercase",
          color: "var(--verde-deep)",
          marginBottom: 8,
        }}
      >
        {copy.title}
      </h1>

      <p style={{ color: "var(--ink-soft)", marginBottom: 36, fontSize: 14 }}>
        {copy.lastUpdateLabel}: {copy.lastUpdate}
      </p>

      {copy.sections.map((s) => (
        <Section key={s.title} title={s.title}>
          {s.body(vars)}
        </Section>
      ))}

      <div
        style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: "2px solid var(--ink)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 22px",
            background: "var(--ink)",
            color: "var(--amarelo)",
            fontFamily: "var(--font-bungee), Bungee, sans-serif",
            fontSize: 13,
            letterSpacing: ".06em",
            border: "2px solid var(--ink)",
            boxShadow: "5px 5px 0 var(--verde)",
            textDecoration: "none",
          }}
        >
          {copy.backHome}
        </Link>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: "var(--font-bungee), Bungee, sans-serif",
          fontSize: 18,
          textTransform: "uppercase",
          letterSpacing: ".04em",
          color: "var(--ink)",
          marginBottom: 12,
          marginTop: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--ink-soft)" }}>{children}</div>
    </section>
  );
}
