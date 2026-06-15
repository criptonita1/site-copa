"use client";

import { useEffect, useRef, useState } from "react";
import type { MatchResult } from "@/types";

interface ScoreEntry extends MatchResult {
  status: "in" | "post";
  detail: string;
}

/** Placar + se o jogo ainda está rolando. `live=true` → em andamento. */
export interface MatchScore extends MatchResult {
  live: boolean;
}

/**
 * Placares automáticos de /api/scores (fonte: ESPN, via nossa rota).
 * Inclui jogos ENCERRADOS (`post` → live:false) E AO VIVO (`in` → live:true),
 * keyed por match.id. Poll a cada `pollMs`; só atualiza o estado quando o
 * conteúdo muda de fato (evita re-render à toa).
 */
export function useScores(pollMs = 60_000): Record<string, MatchScore> {
  const [scores, setScores] = useState<Record<string, MatchScore>>({});
  const lastSerialized = useRef("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch("/api/scores");
        if (!r.ok) return;
        const data = (await r.json()) as { scores?: Record<string, ScoreEntry> };
        if (!alive || !data.scores) return;

        const out: Record<string, MatchScore> = {};
        for (const [id, s] of Object.entries(data.scores)) {
          out[id] = {
            golsMandante: s.golsMandante,
            golsVisitante: s.golsVisitante,
            ...(s.penaltis ? { penaltis: s.penaltis } : {}),
            live: s.status === "in",
          };
        }

        const ser = JSON.stringify(out);
        if (ser !== lastSerialized.current) {
          lastSerialized.current = ser;
          setScores(out);
        }
      } catch {
        // silencioso — provider externo nunca derruba a UI
      }
    }

    load();
    const t = setInterval(load, pollMs);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [pollMs]);

  return scores;
}
