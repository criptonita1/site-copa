"use client";

import { useT } from "@/i18n/LangProvider";
import type { Stage } from "@/types";

/**
 * Tabs de fase. Brasil é destacado em separado (no FilterPanel principal).
 * "Esta semana" é dinâmica baseada em nowMs.
 */
export type TabKey =
  | "semana"
  | "grupos"
  | "32avos"
  | "oitavas"
  | "quartas"
  | "semifinal"
  | "todos";

export interface TabDef {
  key: TabKey;
  label: string;
  /** Stages que entram na tab (vazio = computado dinamicamente). */
  stages?: Stage[];
}

export const TABS: TabDef[] = [
  { key: "semana", label: "Esta semana" },
  { key: "grupos", label: "Fase de grupos", stages: ["abertura", "grupos"] },
  // key interna "32avos" mantida; rótulo correto é "16-avos de final"
  // (Round of 32 = 32 seleções = 16 jogos = 16-avos, termo oficial da FIFA).
  { key: "32avos", label: "16-avos", stages: ["32avos"] },
  { key: "oitavas", label: "Oitavas", stages: ["oitavas"] },
  { key: "quartas", label: "Quartas", stages: ["quartas"] },
  { key: "semifinal", label: "Semi & Final", stages: ["semi", "terceiro", "final"] },
  { key: "todos", label: "Todos os 104" },
];

interface StageTabsProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
  counts: Record<TabKey, number>;
}

export function StageTabs({ active, onChange, counts }: StageTabsProps) {
  const { t } = useT();
  return (
    <div className="stage-tabs" role="tablist" aria-label={t("tab.aria")}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = counts[tab.key] ?? 0;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            className={`stage-tab${isActive ? " active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            <span className="stage-tab-label">{t(`tab.${tab.key}`)}</span>
            <span className="stage-tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
