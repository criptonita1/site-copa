"use client";

import { useCallback, useEffect, useState } from "react";
import { APP, type TimezoneOffset } from "@/config";
import { STORAGE_KEYS, lsGet, lsSet } from "@/lib/storage";

/**
 * Mapa de IANA tz → offset usado no site. Cobre as 4 zonas BR.
 * Fallback pra BRT (-3) pra qualquer fuso não-mapeado.
 */
const TZ_MAP: Record<string, TimezoneOffset> = {
  "America/Sao_Paulo": -3,
  "America/Bahia": -3,
  "America/Fortaleza": -3,
  "America/Recife": -3,
  "America/Belem": -3,
  "America/Maceio": -3,
  "America/Araguaina": -3,
  "America/Manaus": -4,
  "America/Boa_Vista": -4,
  "America/Porto_Velho": -4,
  "America/Campo_Grande": -4,
  "America/Cuiaba": -4,
  "America/Rio_Branco": -5,
  "America/Eirunepe": -5,
  "America/Noronha": -2,
};

function detectBrowserTz(): TimezoneOffset {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TZ_MAP[tz] ?? APP.DEFAULT_TZ_OFFSET;
  } catch {
    return APP.DEFAULT_TZ_OFFSET;
  }
}

export function useTimezone(): {
  offset: TimezoneOffset;
  setOffset: (v: TimezoneOffset) => void;
  hydrated: boolean;
} {
  const [offset, setOffsetState] = useState<TimezoneOffset>(APP.DEFAULT_TZ_OFFSET);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1) tenta localStorage (escolha explícita do user)
    const persisted = lsGet<TimezoneOffset | null>(STORAGE_KEYS.tzOffset, null);
    if (persisted != null) {
      setOffsetState(persisted);
      setHydrated(true);
      return;
    }
    // 2) auto-detect via Intl
    const detected = detectBrowserTz();
    setOffsetState(detected);
    setHydrated(true);
  }, []);

  const setOffset = useCallback((v: TimezoneOffset) => {
    setOffsetState(v);
    lsSet(STORAGE_KEYS.tzOffset, v);
  }, []);

  return { offset, setOffset, hydrated };
}
