"use client";

import { APP, TIMEZONES, type TimezoneOffset } from "@/config";
import { BallSvg, FlagBrSvg } from "@/components/icons";

interface NavProps {
  tzOffset: TimezoneOffset;
  onTzChange: (offset: TimezoneOffset) => void;
}

export function Nav({ tzOffset, onTzChange }: NavProps) {
  return (
    <nav className="nav">
      <a href="#" className="mark" aria-label={APP.SITE_NAME}>
        <span className="ball" aria-hidden="true">
          <BallSvg />
        </span>
        <span className="word">
          ONDE VER A <span>COPA</span>
          <i>!</i>
        </span>
        <FlagBrSvg className="flag-pin" />
      </a>
      <div className="nav-right">
        <select
          className="tz-select"
          aria-label="Fuso horário"
          value={tzOffset}
          onChange={(e) => onTzChange(Number(e.target.value) as TimezoneOffset)}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.offset} value={tz.offset}>
              {tz.code} · {tz.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
