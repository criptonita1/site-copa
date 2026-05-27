"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useNow } from "@/hooks/useNow";
import { useTimezone } from "@/hooks/useTimezone";
import { MATCHES } from "@/lib/matches";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { RollingDivider } from "@/components/RollingDivider";
import { Ticker } from "@/components/Ticker";
import { FilterPanel } from "@/components/FilterPanel";
import { MatchGrid, filterByTab } from "@/components/MatchGrid";
import { StageTabs, TABS, type TabKey } from "@/components/StageTabs";
import { ShareSection } from "@/components/ShareSection";
import { EmailCapture } from "@/components/EmailCapture";
import { PromoSlot } from "@/components/PromoSlot";
import { Footer } from "@/components/Footer";

/**
 * Wrapper único client-side. Mantém todos os estados num só lugar.
 * Tab ativa controla lazy render do MatchGrid.
 */
export function PageShell() {
  const now = useNow(1000);
  const { offset, setOffset } = useTimezone();
  const filters = useFilters();
  const [tab, setTab] = useState<TabKey>("semana");

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

  const { visibleCount, freeCount } = useMemo(() => {
    let v = 0;
    let f = 0;
    for (const m of MATCHES) {
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
  }, [filters.channels, filters.onlyBrazil]);

  return (
    <>
      <div className="br-bg" aria-hidden="true" />
      <main>
        <Nav tzOffset={offset} onTzChange={setOffset} />
        <Hero nowMs={now} tzOffset={offset} />
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
          <StageTabs active={effectiveTab} onChange={setTab} counts={tabCounts} />
        </div>
        <MatchGrid
          nowMs={now}
          tzOffset={offset}
          channels={filters.channels}
          onlyBrazil={filters.onlyBrazil}
          tab={effectiveTab}
        />
        <RollingDivider />
        <ShareSection tzOffset={offset} channels={filters.channels} nowMs={now} />
        <EmailCapture />
        <PromoSlot variant="post-email" />
        <Footer />
      </main>
    </>
  );
}
