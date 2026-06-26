"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useNow } from "@/hooks/useNow";
import { useScores } from "@/hooks/useScores";
import { useTimezone } from "@/hooks/useTimezone";
import { MATCHES } from "@/lib/matches";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { RollingDivider } from "@/components/RollingDivider";
import { Ticker } from "@/components/Ticker";
import { FilterPanel } from "@/components/FilterPanel";
import { MatchGrid, filterByTab, currentPhaseTab } from "@/components/MatchGrid";
import { StageTabs, TABS, type TabKey } from "@/components/StageTabs";
import { ShareSection } from "@/components/ShareSection";
import { EmailCapture } from "@/components/EmailCapture";
import { PromoSlot } from "@/components/PromoSlot";
import { Footer } from "@/components/Footer";
import { LangProvider } from "@/i18n/LangProvider";

/**
 * Wrapper único client-side. Mantém todos os estados num só lugar.
 * Tab ativa controla lazy render do MatchGrid.
 */
export function PageShell() {
  const now = useNow(1000);
  const { offset, setOffset } = useTimezone();
  const filters = useFilters();
  const scores = useScores();
  const [tab, setTab] = useState<TabKey>("semana");
  const [tabTouched, setTabTouched] = useState(false);

  // Na carga, se a fase de grupos já acabou, abre a grade já na fase corrente
  // do mata-mata (32-avos → oitavas → …). Só no client (efeito) pra não
  // divergir do SSR. Não mexe se o usuário já trocou de aba manualmente.
  useEffect(() => {
    if (tabTouched) return;
    const phase = currentPhaseTab(Date.now());
    if (phase !== "semana") setTab(phase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTabChange = (key: TabKey) => {
    setTabTouched(true);
    setTab(key);
  };

  // Counts por tab — granularidade de hora pra não recalcular toda hora
  const hourKey = Math.floor(now / (60 * 60 * 1000));
  const tabCounts = useMemo(() => {
    const nowSnap = hourKey * 60 * 60 * 1000;
    const result: Record<TabKey, number> = {
      semana: filterByTab("semana", nowSnap).length,
      grupos: 0,
      "32avos": 0,
      oitavas: 0,
      quartas: 0,
      semifinal: 0,
      todos: MATCHES.length,
    };
    for (const m of MATCHES) {
      for (const def of TABS) {
        if (def.stages?.includes(m.stage)) {
          result[def.key]++;
          break;
        }
      }
    }
    return result;
  }, [hourKey]);

  const effectiveTab: TabKey = tab;

  // Contador "você vai ver X jogos" — DEVE refletir o que está na tela.
  // Sem o filtro da aba ativa o contador era global, gerando UX confusa:
  // "você vai ver 3 jogos" mas o álbum mostrava só 1 (porque a aba 'esta
  // semana' filtra a janela temporal).
  const { visibleCount, freeCount } = useMemo(() => {
    const nowSnap = hourKey * 60 * 60 * 1000;
    const tabFiltered = filterByTab(effectiveTab, nowSnap);
    let v = 0;
    let f = 0;
    for (const m of tabFiltered) {
      if (filters.onlyBrazil && !m.brasil) continue;
      const watchable = m.canais.some((c) => filters.channels.has(c));
      if (!watchable) continue;
      v++;
      const hasFree = m.canais.some(
        (c) =>
          filters.channels.has(c) &&
          (c === "globo" || c === "sbt" || c === "cazetv"),
      );
      if (hasFree) f++;
    }
    return { visibleCount: v, freeCount: f };
  }, [filters.channels, filters.onlyBrazil, effectiveTab, hourKey]);

  return (
    <LangProvider>
      <div className="br-bg" aria-hidden="true" />
      <main>
        <Nav tzOffset={offset} onTzChange={setOffset} />
        <Hero nowMs={now} tzOffset={offset} scores={scores} />
        <RollingDivider />
        <Ticker />
        <FilterPanel
          channels={filters.channels}
          onToggle={filters.toggleChannel}
          onlyBrazil={filters.onlyBrazil}
          onOnlyBrazil={filters.setOnlyBrazil}
          onClear={filters.reset}
          visibleCount={visibleCount}
          freeCount={freeCount}
        />
        <PromoSlot variant="default" />
        <div className="wrap" style={{ marginTop: 28 }}>
          <StageTabs active={effectiveTab} onChange={onTabChange} counts={tabCounts} />
        </div>
        <MatchGrid
          nowMs={now}
          tzOffset={offset}
          channels={filters.channels}
          onlyBrazil={filters.onlyBrazil}
          tab={effectiveTab}
          scores={scores}
        />
        <RollingDivider />
        <ShareSection
          tzOffset={offset}
          channels={filters.channels}
          onlyBrazil={filters.onlyBrazil}
          nowMs={now}
        />
        <EmailCapture />
        <PromoSlot variant="post-email" />
        <Footer />
      </main>
    </LangProvider>
  );
}
