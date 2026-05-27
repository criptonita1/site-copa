# Deploy — Onde Ver a Copa

Guia passo a passo do que você precisa fazer pra subir em produção.

---

## ⏱️ Tempo estimado: 30 a 60 min (a maioria é esperar DNS)

---

## PARTE 1 — Contas e domínio (faça em paralelo)

### 1.1 Vercel
Já tem conta? Pula. Senão:
- Acessa https://vercel.com/signup
- Login com GitHub (recomendado) ou e-mail
- Plano Hobby é grátis e sobra pro tráfego viral

### 1.2 Domínio (opcional pro primeiro deploy)
**Pode subir em `*.vercel.app` agora e plugar domínio depois.** Mas se já quer domínio:

- **`.com.br`**: https://registro.br — R$ 40/ano, DNS no painel deles
- **`.com`**: https://namecheap.com ou https://cloudflare.com (Cloudflare é mais barato)

Sugestões:
- `ondeveracopa.com.br` (provavelmente livre)
- `ondevercopa.com.br`
- `paspassa.com.br`
- (qualquer outro — checa disponibilidade antes)

### 1.3 Resend (captura de email)
- Cria conta: https://resend.com/signup
- Em **Domains**: adiciona o domínio do site → adiciona os 3 registros DNS no painel do registrador (SPF + DKIM + MX). Espera verificar (1-30 min).
- Em **Audiences**: cria uma audience tipo "Copa 2026 — leads"
- Em **API Keys**: cria uma key com escopo **Full access**. Copia o `re_...`
- Anota: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` (UUID da audience)

> **Sem Resend:** o site funciona, a captura só vira "TÁ ANOTADO" otimista sem salvar nada. Aceitável pra MVP, mas você perde os leads.

### 1.4 URL final do Onchain Cup
Confirma comigo qual a URL definitiva pro `APP.PROMO_URL` em `src/config.ts`. Hoje está `https://onchaincup.com` como placeholder.

---

## PARTE 2 — Deploy preview na Vercel

No terminal, dentro de `~/dev/site-copa`:

```bash
# 1) Instala Vercel CLI (uma vez só, global)
npm i -g vercel

# 2) Faz login (abre o browser)
vercel login

# 3) Linka o projeto à sua conta Vercel (responda as perguntas)
vercel link
#   → "Set up?" → Y
#   → "Which scope?" → seu nome ou time
#   → "Link to existing?" → N (primeira vez)
#   → "Project name?" → site-copa  (ou outro)
#   → "Directory?" → ./
#   → "Override settings?" → N

# 4) Configura as variáveis de ambiente (preview + production)
vercel env add NEXT_PUBLIC_SITE_URL
#   → cola: https://SEU-DOMINIO.com.br (ou deixa vazio pra usar default)
#   → escolhe: Production, Preview, Development

vercel env add RESEND_API_KEY
#   → cola: re_xxxx...
#   → escolhe: Production, Preview

vercel env add RESEND_AUDIENCE_ID
#   → cola: uuid...
#   → escolhe: Production, Preview

vercel env add RESEND_FROM
#   → cola: Onde Ver a Copa <copa@seu-dominio.com.br>
#   → escolhe: Production, Preview

# 5) Deploy preview (sai URL tipo site-copa-abc123.vercel.app)
vercel
```

→ Abre a URL de preview no celular real. Testa:
- Hero carrega rápido
- Tabs funcionam (Esta semana → Grupos → 32-avos…)
- Filtro de canais reage
- Story PNG baixa
- Email aceita ("TÁ ANOTADO!")
- Adicionar ao calendário gera .ics válido

---

## PARTE 3 — Deploy de produção

Se o preview tá bom:

```bash
vercel --prod
```

URL: `site-copa-XXX.vercel.app` (provisório).

### 3.1 Plugar domínio próprio
- Painel Vercel → seu projeto → **Settings → Domains**
- Adiciona `ondeveracopa.com.br` (ou o que você comprou)
- Vercel mostra qual registro DNS adicionar (CNAME ou A) no painel do registrador (registro.br, Cloudflare, etc.)
- Espera propagação (geralmente 5 min a 2h, raramente 24h)
- Vercel emite certificado SSL automaticamente

### 3.2 Ajustar URL canônica
Depois que o domínio estiver no ar:
```bash
vercel env add NEXT_PUBLIC_SITE_URL
#   → cola: https://ondeveracopa.com.br
vercel --prod  # redeploy
```

---

## PARTE 4 — Pós-deploy (faça uma vez)

- **Vercel Analytics**: já injetado, vai começar a registrar automático em prod
- **Google Search Console**: https://search.google.com/search-console → adiciona o domínio → verifica via TXT no DNS → submete o sitemap (`/sitemap.xml`)
- **Compartilhar preview no grupo**: manda o link no WhatsApp da família e mede se viraliza

---

## Comandos úteis pós-deploy

```bash
# Deploy de qualquer mudança local
vercel              # vai pra preview
vercel --prod       # vai pra produção

# Ver logs de função (lembrete API)
vercel logs --follow

# Listar deploys
vercel ls

# Reverter pra deploy anterior
vercel rollback
```

---

## Checklist final (antes de divulgar)

- [ ] Domínio resolvendo + HTTPS verde
- [ ] Hero carrega < 2s no 4G
- [ ] Story PNG baixando em iOS Safari (testa real)
- [ ] Email captura → confere no Resend dashboard que apareceu
- [ ] Lighthouse mobile ≥ 90 (Performance + Acessibilidade + Best Practices + SEO)
- [ ] Onchain Cup URL apontando pro lugar certo (UTMs aparecendo)
- [ ] Compartilhar OG no WhatsApp e ver se a imagem rende bonita
