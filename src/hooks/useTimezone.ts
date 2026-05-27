"use client";

import { useCallback, useEffect, useState } from "react";
import { APP, type TimezoneOffset } from "@/config";
import { STORAGE_KEYS, lsGet, lsSet } from "@/lib/storage";

export function useTimezone(): {
  offset: TimezoneOffset;
  setOffset: (v: TimezoneOffset) => void;
  hydrated: boolean;
} {
  const [offset, setOffsetState] = useState<TimezoneOffset>(APP.DEFAULT_TZ_OFFSET);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = lsGet<TimezoneOffset>(
      STORAGE_KEYS.tzOffset,
      APP.DEFAULT_TZ_OFFSET,
    );
    setOffsetState(persisted);
    setHydrated(true);
  }, []);

  const setOffset = useCallback((v: TimezoneOffset) => {
    setOffsetState(v);
    lsSet(STORAGE_KEYS.tzOffset, v);
  }, []);

  return { offset, setOffset, hydrated };
}
