"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_USER_CHANNELS } from "@/data/channels";
import { STORAGE_KEYS, lsGet, lsSet } from "@/lib/storage";
import type { ChannelId } from "@/types";

export interface FiltersState {
  channels: Set<ChannelId>;
  onlyBrazil: boolean;
}

export interface FiltersApi extends FiltersState {
  toggleChannel: (id: ChannelId) => void;
  setOnlyBrazil: (v: boolean) => void;
  reset: () => void;
}

export function useFilters(): FiltersApi {
  // SSR: default determinístico
  const [channels, setChannels] = useState<Set<ChannelId>>(
    () => new Set(DEFAULT_USER_CHANNELS),
  );
  const [onlyBrazil, setOnlyBrazilState] = useState(false);

  // Hidrata após mount
  useEffect(() => {
    const persistedChannels = lsGet<ChannelId[]>(
      STORAGE_KEYS.channels,
      DEFAULT_USER_CHANNELS,
    );
    const persistedOnlyBr = lsGet<boolean>(STORAGE_KEYS.onlyBrazil, false);
    setChannels(new Set(persistedChannels));
    setOnlyBrazilState(persistedOnlyBr);
  }, []);

  const toggleChannel = useCallback((id: ChannelId) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      lsSet(STORAGE_KEYS.channels, Array.from(next));
      return next;
    });
  }, []);

  const setOnlyBrazil = useCallback((v: boolean) => {
    setOnlyBrazilState(v);
    lsSet(STORAGE_KEYS.onlyBrazil, v);
  }, []);

  const reset = useCallback(() => {
    const all = new Set<ChannelId>([
      "globo",
      "sbt",
      "cazetv",
      "sportv",
      "nsports",
    ]);
    setChannels(all);
    setOnlyBrazilState(false);
    lsSet(STORAGE_KEYS.channels, Array.from(all));
    lsSet(STORAGE_KEYS.onlyBrazil, false);
  }, []);

  return { channels, onlyBrazil, toggleChannel, setOnlyBrazil, reset };
}
