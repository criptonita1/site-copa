# Onde Ver a Copa — 2026

Site estático mobile-first que mostra ao torcedor brasileiro onde assistir cada jogo da Copa do Mundo 2026 (Globo, SBT, CazéTV, SporTV, N Sports). Funil pra divulgar o [Onchain Cup](https://onchaincup.com).

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind**
- **Vercel** edge runtime pra `/api/lembrete`
- **Resend** pra captura de email otimista
- **Vercel Analytics** built-in
- **104 jogos** validados via Zod no `prebuild`

## Rodar local

```bash
npm install
cp .env.local.example .env.local   # edita com valores reais (ou deixa Resend vazio pra testar)
npm run dev                         # http://localhost:3000
```

## Comandos

```bash
npm run dev          # dev server
npm run build        # build de produção (valida JSON antes)
npm run start        # serve build de produção
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run validate     # roda só o validate-matches sem buildar
```

## Deploy

Veja **[DEPLOY.md](./DEPLOY.md)** pro passo a passo na Vercel.

## Estrutura

```
src/
  config.ts                    # branding (APP, TIMEZONES)
  types.ts                     # Match, Channel, Stage
  data/
    channels.ts                # 7 canais de TV
    teams.ts                   # 48 seleções + cores das camisas
    matches.json               # 104 jogos (fonte da verdade)
  lib/
    time.ts                    # conversão de fuso + matchState
    matches.ts                 # helpers (nextBrazil, etc.)
    ics.ts                     # gerador .ics
    share-card.ts              # canvas 1080×1920 (dynamic import)
    whatsapp.ts                # links wa.me
    jersey.tsx                 # SVG das camisas
    storage.ts                 # localStorage SSR-safe
    utm.ts                     # UTM helper
  hooks/
    useNow.ts                  # tick global 1s
    useFilters.ts              # canais + Brasil
    useTimezone.ts             # fuso BRT/AMT/ACT/FNT
  components/
    Nav, Hero, Countdown, GoalNet, RollingDivider, FieldBg,
    Ticker, FilterPanel, StageTabs, MatchGrid, MatchCard,
    ChannelBadge, ShareSection, StoryPreview, EmailCapture,
    PromoSlot, Footer, PageShell
  app/
    layout.tsx                 # fonts + metadata + JSON-LD
    page.tsx                   # = <PageShell />
    api/lembrete/route.ts      # edge — recebe email
    opengraph-image.tsx        # OG dinâmico
    icon.tsx                   # favicon
    not-found.tsx              # 404
    loading.tsx                # skeleton
    error.tsx                  # boundary
    sitemap.ts / robots.ts
scripts/
  validate-matches.ts          # roda no prebuild
```

## Atualizando dados dos jogos

Editar `src/data/matches.json` e rodar `npm run validate`. O Zod quebra o build se:
- Não tem exatamente 104 jogos
- IDs duplicados ou fora do padrão `MNNN`
- Falta seleção (precisa de exatamente 48 únicas na fase de grupos)
- "A definir" em jogo de fase de grupos
- Cidade não bate com país
- Estádio em cidades diferentes
- Dois jogos no mesmo estádio em janelas sobrepostas
- Jogo do Brasil sem `canaisConfirmados: true`

## Trocar de app divulgado

Editar `src/config.ts` — `APP.PROMO_NAME`, `APP.PROMO_URL`, `APP.PROMO_TAGLINE`. Tudo lê daqui, nada hardcoded em JSX.

## Licença

Não afiliado à FIFA nem a emissoras. Camisas e identidades visuais são ilustrações originais.
