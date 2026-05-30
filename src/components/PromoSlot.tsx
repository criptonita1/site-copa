import { APP } from "@/config";
import { ArrowDownSvg } from "@/components/icons";
import { withUtm } from "@/lib/utm";

/**
 * Slot nativo (não banner) que divulga o app dono. Aparece em duas variantes:
 * - "default": entre o filtro e o grid, copy de descoberta
 * - "post-email": depois do email capture, copy de conversão
 */
type Variant = "default" | "post-email";

interface PromoSlotProps {
  variant?: Variant;
}

const COPY: Record<Variant, { headline: string; body: string; cta: string; utm: string }> = {
  default: {
    headline: APP.PROMO_NAME,
    body: APP.PROMO_TAGLINE,
    cta: "CONHECER",
    utm: "promo-default",
  },
  "post-email": {
    headline: "TÁ AMARRADO COM A COPA?",
    body: `Junta a galera pra viver a Copa no ${APP.PROMO_NAME}. Tudo onchain, sem complicação.`,
    cta: "ABRIR O APP",
    utm: "promo-post-email",
  },
};

export function PromoSlot({ variant = "default" }: PromoSlotProps) {
  const copy = COPY[variant];
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
