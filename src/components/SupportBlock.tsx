"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { SUPPORT } from "@/config";
import { buildPixPayload } from "@/lib/pix";

type Method = "eth" | "sol" | "pix";

const PIX_PAYLOAD = buildPixPayload({
  key: SUPPORT.PIX.KEY,
  name: SUPPORT.PIX.NAME,
  city: SUPPORT.PIX.CITY,
});

function shorten(s: string, head = 6, tail = 4) {
  return s.length <= head + tail + 3 ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;
}

interface Item {
  id: Method;
  tag: string;
  qr: string;
  href?: string; // tap em mobile abre wallet (silent fail em desktop)
  copyValue: string;
  displayValue: string;
}

const ITEMS: Item[] = [
  {
    id: "eth",
    tag: "ETH",
    qr: "/qr/eth.svg",
    href: `ethereum:${SUPPORT.ETH.ADDRESS}`,
    copyValue: SUPPORT.ETH.ADDRESS,
    displayValue: shorten(SUPPORT.ETH.ADDRESS, 6, 4),
  },
  {
    id: "sol",
    tag: "SOL",
    qr: "/qr/sol.svg",
    href: `solana:${SUPPORT.SOL.ADDRESS}`,
    copyValue: SUPPORT.SOL.ADDRESS,
    displayValue: shorten(SUPPORT.SOL.ADDRESS, 6, 4),
  },
  {
    id: "pix",
    tag: "PIX",
    qr: "/qr/pix.svg",
    copyValue: PIX_PAYLOAD,
    displayValue: "copia e cola",
  },
];

export function SupportBlock() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<Method | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("support_viewed");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function copy(method: Method, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(method);
      track("support_copy", { method });
      setTimeout(() => setCopied((c) => (c === method ? null : c)), 2400);
    } catch {
      /* clipboard bloqueado */
    }
  }

  return (
    <div className="support" ref={sectionRef}>
      <p className="support-msg">
        Feito por uma pessoa só, sem anúncio e sem rastreador.
        <br />
        Se te ajudou, <em>me paga um café</em> pra manter no ar até a final.
      </p>

      <div className="support-row">
        {ITEMS.map((item) => {
          const isCopied = copied === item.id;
          const qrImg = (
            <img
              src={item.qr}
              alt={`QR ${item.tag}`}
              width={112}
              height={112}
              className="support-qr"
            />
          );
          return (
            <div className="support-item" key={item.id}>
              <span className="support-item-tag">{item.tag}</span>
              {item.href ? (
                <a
                  href={item.href}
                  className="support-qr-wrap"
                  aria-label={`Tap pra abrir wallet ${item.tag} (só celular com wallet instalada)`}
                  onClick={() => track("support_qr_tap", { method: item.id })}
                >
                  {qrImg}
                </a>
              ) : (
                <div className="support-qr-wrap">{qrImg}</div>
              )}
              <code className="support-addr">{item.displayValue}</code>
              <button
                type="button"
                className={`support-cta${isCopied ? " is-ok" : ""}`}
                onClick={() => copy(item.id, item.copyValue)}
              >
                {isCopied ? "★ COPIADO" : "COPIAR"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="support-howto">
        Copia → cola na sua <em>wallet</em> (ETH/SOL) ou no <em>Pix copia-e-cola</em> do seu banco.
        <br />
        No celular com wallet/banco instalado, o QR também escaneia direto.
      </p>
    </div>
  );
}
