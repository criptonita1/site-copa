# Onde Ver a Copa — Contexto para Claude Code

> Este arquivo é lido automaticamente quando você abre o Claude Code aqui.
> Mantém o contexto entre sessões. Edite quando algo importante mudar.

## O que é

Site brasileiro mobile-first que responde "em qual canal eu vejo cada jogo da
Copa do Mundo 2026?". 104 jogos validados, tabs por fase, filtros de canais,
countdown pro Brasil, story PNG 1080×1920 compartilhável.

**Faz parte do ecossistema Onchain Cup, NÃO do Verbo App.** São projetos
totalmente separados. Nada de Supabase, OpenAI, Stripe aqui.

- **Autoria:** Modular (https://modular.tech)
- **Promo (CTA do site):** Onchain Cup (https://onchaincup.io)

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind
- Vercel (deploy + Analytics)
- Resend (captura de email — quando configurado)
- Sem banco de dados — 104 jogos em `src/data/matches.json` validados por Zod no prebuild

## Estado atual (atualize quando mudar)

- ✅ Build verde, working tree clean
- ✅ **Site no ar:** https://www.ondeveracopa.com.br (domínio próprio .com.br, registrado em CNPJ MC Soluções via Registro.br)
- ✅ GitHub: https://github.com/criptonita1/site-copa (privado)
- ✅ **Vercel ↔ GitHub conectados** — `git push main` faz auto-deploy
- ✅ **Resend configurado e funcionando** — domínio verificado (DKIM/SPF/MX), captura cria contato na audience real (testado 2026-05-29)
- ✅ Página `/privacidade` LGPD-compliant (Modular como operador, contato info@modularcrypto.xyz)
- ✅ Links clicáveis nos canais (CazéTV → YouTube, Globoplay, SporTV etc) via `ChannelBadge`
- ❌ **Sem lembrete automático ainda** — captura emails mas nenhum cron envia. Promessa do site "manda 2h antes" não é cumprida tecnicamente. Precisa Vercel Cron + Resend Broadcasts.
- ❌ **Sem email de confirmação ao cadastrar** — silent success (LGPD bom, UX ruim — usuário não sabe se deu certo)

## Env vars production (Vercel)

- `RESEND_API_KEY` — **Full Access** (Sending-only não cria contato, dá `restricted_api_key`)
- `RESEND_AUDIENCE_ID=661ffade-63a7-488e-a5af-75debb88e724`
- `RESEND_FROM=Onde Ver a Copa <lembrete@ondeveracopa.com.br>`
- `NEXT_PUBLIC_SITE_URL=https://www.ondeveracopa.com.br`

## Próximas 3 ações pendentes

1. **Cron de lembrete** — Vercel Cron diário/horário que lê próximo jogo do Brasil de `matches.json`, dispara broadcast via Resend 2h antes (~2-3h código). Precisa: lock anti-reenvio (Vercel KV ou Upstash Redis).
2. **Email de confirmação ao cadastrar** — usuário recebe "tá anotado" instantâneo (~30min)
3. **Página `/jogo/[id]`** — SEO de cauda longa, 1 página por jogo

## Comandos úteis

```bash
npm run dev          # dev server
npm run build        # build de produção (valida JSON antes)
npm run validate     # roda só o Zod sem buildar
npm run typecheck    # tsc --noEmit

# Deploy
npx vercel              # preview
npx vercel --prod       # produção

# Env vars (quando Resend estiver pronto)
npx vercel env add RESEND_API_KEY production
npx vercel env add RESEND_AUDIENCE_ID production
npx vercel env add RESEND_FROM production
npx vercel env add NEXT_PUBLIC_SITE_URL production
```

## Decisões já tomadas (não revisitar sem motivo)

- **Sem banco** — JSON estático bata pro tráfego viral
- **Lazy render por tab** — só ~10 cards no DOM, não os 104
- **Tabs de fase** (Esta semana / Grupos / 32-avos / Oitavas / Quartas / Semi+Final / Todos)
- **Toggle "Só Brasil"** cumulativo com tabs
- **Fontes:** Anton (display) + Archivo (body+italic) + Bungee (badges) + Space Mono (mono). Caveat removida.
- **Sem bandeirinhas Festa Junina** — removidas, não combinaram com resto
- **3 peças visuais do claude design:** GoalNet (hero), RollingDivider (entre seções), FieldBg (atrás do grid)
- **Hidratação:** `useNow` retorna 0 no SSR pra evitar mismatch React #422/#425
- **Memo agressivo:** `MatchCard` com comparator que só re-renderiza no segundo se jogo está em janela viva (-5min..+5min)
- **Security headers** em prod (CSP estrita) e dev (com 'unsafe-eval' pra Fast Refresh)
- **UTMs** em todos os links externos pro Onchain Cup
- **104 jogos:** dados atualizados pós-repescagem (Turquia, Suécia, Tcheca, Bósnia, RDC, Iraque incluídos)

## Validações no prebuild

`scripts/validate-matches.ts` quebra o build se:
- Total ≠ 104
- IDs duplicados ou fora do padrão MNNN
- Falta seleção (precisa de exatamente 48 únicas na fase de grupos)
- "A definir" em jogo de fase de grupos
- Cidade não bate com país (catálogo de 16 cidades-sede canônico)
- Estádio em cidades diferentes
- Dois jogos no mesmo estádio em janelas sobrepostas (kickoff..+135min)
- Jogo do Brasil sem `canaisConfirmados: true`

## Funil pro Onchain Cup

- `PromoSlot variant="default"`: entre FilterPanel e MatchGrid
- `PromoSlot variant="post-email"`: depois do EmailCapture
- Footer "feito por Modular" (autoria)
- Card PNG compartilhável assina "feito por Modular"
- WhatsApp share por jogo + share geral
- Todos os links pro Onchain Cup com UTMs

## Como atualizar dados dos jogos

1. Editar `src/data/matches.json`
2. `npm run validate` — confirma que passa
3. `git add . && git commit -m "data: ..."` + push
4. `npx vercel --prod`

## Como trocar de app divulgado

Editar `src/config.ts` — `APP.PROMO_NAME`, `APP.PROMO_URL`, `APP.PROMO_TAGLINE`.
Nada hardcoded em JSX.

## Arquitetura — onde está cada coisa

```
src/
  config.ts                    # APP (branding) + TIMEZONES + tipo TimezoneOffset
  types.ts                     # Match, Channel, Stage, MatchState
  data/
    channels.ts                # 7 canais TV + DEFAULT_USER_CHANNELS + constants
    teams.ts                   # 48 seleções com cores de camisa SVG
    matches.json               # 104 jogos (FONTE DA VERDADE)
  lib/
    time.ts                    # fmt + matchState (105/130min) + countdownTo
    matches.ts                 # helpers (nextBrazil, getById)
    ics.ts                     # gerador .ics com fold RFC 5545
    share-card.ts              # canvas 1080×1920 (dynamic import)
    whatsapp.ts                # wa.me links
    jersey.tsx                 # SVG das camisas
    storage.ts                 # localStorage SSR-safe
    utm.ts                     # UTM helper
  hooks/
    useNow.ts                  # tick global 1s (SSR=0 → client Date.now)
    useFilters.ts              # canais + onlyBrazil + localStorage
    useTimezone.ts             # auto-detect Intl + 4 BR tz + localStorage
  components/
    Nav, Hero, Countdown, GoalNet, RollingDivider, FieldBg, Ticker,
    FilterPanel, StageTabs, MatchGrid, MatchCard, ChannelBadge,
    ShareSection, StoryPreview, EmailCapture, PromoSlot, Footer,
    PageShell, icons.tsx
  app/
    layout.tsx                 # fonts + metadata + JSON-LD (SportsEvent + BroadcastEvent)
    page.tsx                   # <PageShell />
    api/lembrete/route.ts      # edge — rate-limit por IP, honeypot, Resend
    opengraph-image.tsx        # OG dinâmico
    icon.tsx                   # favicon
    not-found.tsx              # 404 brandado
    loading.tsx                # skeleton
    error.tsx                  # boundary
    sitemap.ts / robots.ts
scripts/
  validate-matches.ts          # prebuild Zod
```

## Ainda no roadmap (pós-launch)

- Página por jogo `/jogo/[id]` (SEO de cauda longa)
- Placar ao vivo (API pública ESPN)
- Watchlist ("⭐ vou ver esse")
- Bracket compartilhável pós-grupos
- PWA + manifest
- Push notifications web
- Blog `/blog/` com 3 posts SEO pré-Copa
- A/B test do PromoSlot
