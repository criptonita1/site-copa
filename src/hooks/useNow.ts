"use client";

import { useEffect, useState } from "react";

/**
 * Tick global. Fonte única de "agora" pra countdown, estado AO VIVO, etc.
 *
 * IMPORTANTE: SSR retorna 0 (constante estável), client preenche com Date.now()
 * no useEffect. Isso evita hydration mismatch — o servidor não pode saber
 * que horas são "no cliente". Componentes que dependem de tempo real devem
 * tratar `nowMs === 0` como "ainda não hidratado" (mostrar 00:00 etc).
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
