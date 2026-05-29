import type { Metadata } from "next";
import Link from "next/link";
import { APP } from "@/config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Onde Ver a Copa trata seu email e dados de navegação. Conforme LGPD.",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "info@modularcrypto.xyz";
const LAST_UPDATE = "29 de maio de 2026";

export default function PrivacidadePage() {
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
        ★ {APP.SITE_NAME}
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
        Política de Privacidade
      </h1>

      <p style={{ color: "var(--ink-soft)", marginBottom: 36, fontSize: 14 }}>
        Última atualização: {LAST_UPDATE}
      </p>

      <Section title="1. Quem somos">
        <p>
          O <strong>{APP.SITE_NAME}</strong> é um site informativo gratuito,
          mantido por <strong>{APP.AUTHOR_NAME}</strong>, que indica em quais
          canais cada jogo da Copa 2026 será transmitido no Brasil.
        </p>
        <p>
          Não somos afiliados à FIFA, às emissoras de TV, aos serviços de
          streaming ou às seleções nacionais. Todas as marcas mencionadas
          pertencem aos seus respectivos titulares.
        </p>
      </Section>

      <Section title="2. Que dados coletamos">
        <p>Coletamos o mínimo necessário pra você usar o site:</p>
        <ul>
          <li>
            <strong>Email</strong> — somente se você inscrever voluntariamente
            no formulário &quot;Me avisa antes do jogo&quot;.
          </li>
          <li>
            <strong>Preferências de navegação</strong> — canais marcados, fuso
            horário, filtro &quot;só Brasil&quot;. Ficam só no seu navegador
            (localStorage), não vão pro nosso servidor.
          </li>
          <li>
            <strong>Dados de navegação anônimos</strong> — páginas vistas,
            tempo de visita, país aproximado, dispositivo. Coletados via
            Vercel Analytics, sem cookies e sem identificar você
            pessoalmente.
          </li>
        </ul>
      </Section>

      <Section title="3. Pra que usamos">
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
      </Section>

      <Section title="4. Base legal (LGPD)">
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
      </Section>

      <Section title="5. Com quem compartilhamos">
        <p>
          Pra operar o site, usamos serviços de terceiros que atuam como{" "}
          <strong>operadores</strong> dos seus dados:
        </p>
        <ul>
          <li>
            <strong>Resend</strong> (resend.com) — armazena seu email e envia
            os lembretes. Sediado nos EUA, com cláusulas padrão de
            transferência internacional.
          </li>
          <li>
            <strong>Vercel</strong> (vercel.com) — hospeda o site e fornece
            analytics anônimo.
          </li>
        </ul>
        <p>
          <strong>Nunca vendemos</strong> seu email. Nunca compartilhamos com
          terceiros pra fins de marketing.
        </p>
      </Section>

      <Section title="6. Por quanto tempo guardamos">
        <p>
          Seu email fica salvo até:
        </p>
        <ul>
          <li>Você pedir exclusão (a qualquer momento — ver seção 8); ou</li>
          <li>
            O fim do ciclo de uso do site (até 6 meses após o término da Copa
            2026).
          </li>
        </ul>
      </Section>

      <Section title="7. Seus direitos (LGPD)">
        <p>Você tem direito de, a qualquer momento, solicitar:</p>
        <ul>
          <li>Confirmação de que tratamos seus dados</li>
          <li>Acesso aos dados que temos</li>
          <li>Correção de dados incompletos ou incorretos</li>
          <li>Exclusão dos seus dados</li>
          <li>Portabilidade pra outro serviço</li>
          <li>Revogação do consentimento</li>
        </ul>
      </Section>

      <Section title="8. Como exercer seus direitos">
        <p>
          Mande email pra{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=LGPD%20%E2%80%94%20${encodeURIComponent(APP.SITE_NAME)}`}
            style={{ color: "var(--verde-deep)", fontWeight: 700 }}
          >
            {CONTACT_EMAIL}
          </a>{" "}
          com o assunto &quot;LGPD&quot; e descreva o que você quer (excluir,
          acessar, corrigir, etc).
        </p>
        <p>Respondemos em até 15 dias.</p>
      </Section>

      <Section title="9. Segurança">
        <p>
          Usamos HTTPS em todo o site, rate-limit no formulário de email pra
          evitar abuso, e nossos operadores (Resend, Vercel) seguem padrões
          internacionais de segurança. Mesmo assim, nenhum sistema é 100%
          seguro — se rolar incidente que possa afetar seus dados, vamos
          comunicar conforme exigido pela LGPD.
        </p>
      </Section>

      <Section title="10. Cookies">
        <p>
          <strong>Não usamos cookies de rastreamento.</strong> O site funciona
          totalmente com armazenamento local do seu navegador (localStorage)
          pra lembrar suas preferências. Vercel Analytics, nosso provedor de
          métricas, é cookieless.
        </p>
      </Section>

      <Section title="11. Mudanças nesta política">
        <p>
          Se mudarmos algo material, atualizamos a data no topo e — se a
          mudança afetar seu consentimento — pedimos sua confirmação de novo.
        </p>
      </Section>

      <Section title="12. Contato">
        <p>
          Qualquer dúvida, pedido ou reclamação:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{ color: "var(--verde-deep)", fontWeight: 700 }}
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>
          Operado por <strong>{APP.AUTHOR_NAME}</strong> ·{" "}
          <a
            href={APP.AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--verde-deep)" }}
          >
            {APP.AUTHOR_URL.replace(/^https?:\/\//, "")}
          </a>
        </p>
      </Section>

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
          ← VOLTAR PRA HOME
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
  children: React.ReactNode;
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
