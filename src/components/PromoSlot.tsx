"use client";

import { APP } from "@/config";
import { ArrowDownSvg } from "@/components/icons";
import { withUtm } from "@/lib/utm";
import { useT } from "@/i18n/LangProvider";

/**
 * Slot nativo (não banner) que divulga o app dono. Aparece em duas variantes:
 * - "default": entre o filtro e o grid, copy de descoberta
 * - "post-email": depois do email capture, copy de conversão
 */
type Variant = "default" | "post-email";

interface PromoSlotProps {
  variant?: Variant;
}

export function PromoSlot({ variant = "default" }: PromoSlotProps) {
  const { t } = useT();
  const copy =
    variant === "post-email"
      ? {
          headline: t("promo.peHead"),
          body: t("promo.peBody", { app: APP.PROMO_NAME }),
          cta: t("promo.peCta"),
          utm: "promo-post-email",
        }
      : {
          headline: APP.PROMO_NAME,
          body: t("promo.defaultTagline"),
          cta: t("promo.cta"),
          utm: "promo-default",
        };
  return (
    <div className="wrap">
      <div className={`promo-slot promo-slot--${variant}`}>
        <div className="promo-text">
          <b>{copy.headline}</b>
          <br />
          {copy.body}
        </div>
        <a
          className="promo-cta"
          href={withUtm(APP.PROMO_URL, copy.utm)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.cta}
          <ArrowDownSvg />
        </a>
      </div>
    </div>
  );
}
