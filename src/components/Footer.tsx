import { APP } from "@/config";
import { StarSvg } from "@/components/icons";
import { SupportBlock } from "@/components/SupportBlock";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <SupportBlock />
        <div className="foot-grid">
          <div>
            <div className="stars-5" aria-label="Brasil pentacampeão">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarSvg key={i} />
              ))}
              <span className="label">BRASIL PENTACAMPEÃO · RUMO AO HEXA</span>
            </div>
            <div className="foot-mark">
              ONDE VER A <em>COPA!</em>
            </div>
          </div>
          <div className="foot-meta">
            FEITO POR{" "}
            <a
              href={APP.AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>{APP.AUTHOR_NAME.toUpperCase()}</b>
            </a>
            <br />
            <b>2026</b> · BRASIL HEXA (se Deus quiser)
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            SITE INFORMATIVO INDEPENDENTE · SEM AFILIAÇÃO COM EMISSORAS OU
            SELEÇÕES ·{" "}
            <a
              href="/privacidade"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              PRIVACIDADE
            </a>
          </span>
          <span>{APP.HASHTAG}</span>
        </div>
      </div>
    </footer>
  );
}
