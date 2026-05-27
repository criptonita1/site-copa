"use client";

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
  { key: "32avos", label: "32-avos", stages: ["32avos"] },
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
  return (
    <div className="stage-tabs" role="tablist" aria-label="Filtrar por fase">
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
            <span className="stage-tab-label">{tab.label}</span>
            <span className="stage-tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
