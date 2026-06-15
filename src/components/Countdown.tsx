"use client";

import { memo } from "react";
import { countdownTo, pad2 } from "@/lib/time";
import { useT } from "@/i18n/LangProvider";

interface CountdownProps {
  kickoffUTC: string;
  nowMs: number;
}

/**
 * Countdown isolado em memo. Sem isso, o Hero inteiro re-renderiza a cada
 * segundo só pra atualizar 4 dígitos. Aqui só esse subtree muda.
 */
function CountdownImpl({ kickoffUTC, nowMs }: CountdownProps) {
  const { t } = useT();
  const cd = countdownTo(kickoffUTC, nowMs);
  return (
    <div className="cd" role="timer" aria-live="polite">
      <div className="cell">
        <div className="num">{pad2(cd.d)}</div>
        <div className="lab">{t("cd.days")}</div>
      </div>
      <div className="cell">
        <div className="num">{pad2(cd.h)}</div>
        <div className="lab">{t("cd.hours")}</div>
      </div>
      <div className="cell">
        <div className="num">{pad2(cd.m)}</div>
        <div className="lab">{t("cd.min")}</div>
      </div>
      <div className="cell s">
        <div className="num">{pad2(cd.s)}</div>
        <div className="lab">{t("cd.sec")}</div>
      </div>
    </div>
  );
}

export const Countdown = memo(CountdownImpl);
