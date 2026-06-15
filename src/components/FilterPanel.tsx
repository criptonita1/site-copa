"use client";

import { track } from "@vercel/analytics";
import { CHANNELS, FREE_CHANNELS, PAID_CHANNELS } from "@/data/channels";
import { useT } from "@/i18n/LangProvider";
import type { ChannelId } from "@/types";

interface FilterPanelProps {
  channels: Set<ChannelId>;
  onToggle: (id: ChannelId) => void;
  onlyBrazil: boolean;
  onOnlyBrazil: (v: boolean) => void;
  onClear: () => void;
  visibleCount: number;
  freeCount: number;
}

export function FilterPanel({
  channels,
  onToggle,
  onlyBrazil,
  onOnlyBrazil,
  onClear,
  visibleCount,
  freeCount,
}: FilterPanelProps) {
  const { t } = useT();
  return (
    <section className="filters-section" id="grade">
      <div className="wrap">
        <div className="filters-head">
          <h2 className="filters-title">
            <span className="uw">{t("filter.title1")}</span>
            <br />
            {t("filter.title2")} <em>{t("filter.titleEm")}</em>
          </h2>
          <p className="filters-sub">{t("filter.sub")}</p>
        </div>

        <div className="filter-panel">
          <div className="filter-panel-head">
            <span className="ctrl-label">{t("filter.head")}</span>
            <span className="note">{t("filter.note")}</span>
          </div>
          <div className="filter-panel-body">
            <div className="filter-row" role="group" aria-label={t("filter.freeGroup")}>
              <span className="row-label">{t("filter.freeRow")}</span>
              {FREE_CHANNELS.map((id) => {
                const ch = CHANNELS[id];
                const active = channels.has(id);
                return (
                  <button
                    key={id}
                    className={`chip ${active ? "active" : ""}`}
                    data-channel={id}
                    data-kind="free"
                    aria-pressed={active}
                    aria-label={t("filter.chFree", {
                      name: ch.nome,
                      state: active ? t("filter.checked") : t("filter.unchecked"),
                    })}
                    onClick={() => {
                      track("filter_channel_toggle", {
                        channel: id,
                        on: !active,
                        kind: "free",
                      });
                      onToggle(id);
                    }}
                  >
                    <span className="dot" />
                    {ch.nome}
                  </button>
                );
              })}
            </div>
            <div className="filter-row" role="group" aria-label={t("filter.paidGroup")}>
              <span className="row-label">{t("filter.paidRow")}</span>
              {PAID_CHANNELS.map((id) => {
                const ch = CHANNELS[id];
                const active = channels.has(id);
                return (
                  <button
                    key={id}
                    className={`chip ${active ? "active" : ""}`}
                    data-channel={id}
                    data-kind="paid"
                    aria-pressed={active}
                    aria-label={t("filter.chPaid", {
                      name: ch.nome,
                      state: active ? t("filter.checked") : t("filter.unchecked"),
                    })}
                    onClick={() => {
                      track("filter_channel_toggle", {
                        channel: id,
                        on: !active,
                        kind: "paid",
                      });
                      onToggle(id);
                    }}
                  >
                    <span className="dot" />
                    {ch.nome}
                  </button>
                );
              })}
            </div>
            <div className="filter-row">
              <span className="row-label">{t("filter.quick")}</span>
              <button
                className={`toggle-bra ${onlyBrazil ? "on" : ""}`}
                aria-pressed={onlyBrazil}
                onClick={() => {
                  track("filter_only_brazil_toggle", { on: !onlyBrazil });
                  onOnlyBrazil(!onlyBrazil);
                }}
              >
                <span className="sw" />
                <span className="lbl">
                  {t("filter.onlyBrazil")} <b>{t("filter.onlyBrazilB")}</b>
                </span>
              </button>
            </div>
          </div>
          <div className="filter-summary">
            <div className="count">
              {channels.size === 0 ? (
                <span style={{ fontFamily: "var(--font-archivo)", fontStyle: "italic" }}>
                  {t("filter.noChannels")}
                </span>
              ) : (
                <>
                  {t("filter.countPre")}
                  <b>{visibleCount}</b>
                  {t("filter.countGames")} ·{" "}
                  <span className="free">
                    <b>{freeCount}</b> {t("filter.countFree")}
                  </span>
                </>
              )}
            </div>
            <button className="clear" onClick={onClear}>
              {t("filter.clear")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
