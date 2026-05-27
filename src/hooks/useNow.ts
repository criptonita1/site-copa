"use client";

import { useEffect, useState } from "react";

/**
 * Tick global de 1s. Fonte única de "agora" pra countdown, estado AO VIVO, etc.
 * Inicializa com Date.now() server-side (estável) e atualiza no client.
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
