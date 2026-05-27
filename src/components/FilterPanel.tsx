"use client";

import { CHANNELS, FREE_CHANNELS, PAID_CHANNELS } from "@/data/channels";
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
  return (
    <section className="filters-section" id="grade">
      <div className="wrap">
        <div className="filters-head">
          <h2 className="filters-title">
            <span className="uw">Bora ver</span>
            <br />
            onde <em>passa.</em>
          </h2>
          <p className="filters-sub">
            Marca os canais que você tem. A grade reage — o que dá pra ver fica nítido, o
            resto desbota. <b>Grátis em verde, pago em azul.</b>
          </p>
        </div>

        <div className="filter-panel">
          <div className="filter-panel-head">
            <span className="ctrl-label">★ MEU CONTROLE REMOTO</span>
            <span className="note">o que você assina?</span>
          </div>
          <div className="filter-panel-body">
            <div className="filter-row" role="group" aria-label="Canais grátis">
              <span className="row-label">DE GRAÇA — TV ABERTA + STREAMING</span>
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
                    onClick={() => onToggle(id)}
                  >
                    <span className="dot" />
                    {ch.nome}
                  </button>
                );
              })}
            </div>
            <div className="filter-row" role="group" aria-label="Canais pagos">
              <span className="row-label">PAGO — TV POR ASSINATURA</span>
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
                    onClick={() => onToggle(id)}
                  >
                    <span className="dot" />
                    {ch.nome}
                  </button>
                );
              })}
            </div>
            <div className="filter-row">
              <span className="row-label">FILTRO RÁPIDO</span>
              <button
                className={`toggle-bra ${onlyBrazil ? "on" : ""}`}
                aria-pressed={onlyBrazil}
                onClick={() => onOnlyBrazil(!onlyBrazil)}
              >
                <span className="sw" />
                <span className="lbl">
                  SÓ JOGO DO <b>BRASIL!</b>
                </span>
              </button>
            </div>
          </div>
          <div className="filter-summary">
            <div className="count">
              você vai ver
              <b>{visibleCount}</b>
              jogos ·{" "}
              <span className="free">
                <b>{freeCount}</b> de graça
              </span>
            </div>
            <button className="clear" onClick={onClear}>
              limpar tudo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
