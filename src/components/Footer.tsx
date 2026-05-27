import { APP } from "@/config";
import { withUtm } from "@/lib/utm";
import { StarSvg } from "@/components/icons";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="stars-5" aria-label="Pentacampeão">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarSvg key={i} />
              ))}
              <span className="label">PENTACAMPEÃO · RUMO AO HEXA</span>
            </div>
            <div className="foot-mark">
              ONDE VER A <em>COPA!</em>
            </div>
          </div>
          <div className="foot-meta">
            FEITO POR{" "}
            <a
              href={withUtm(APP.PROMO_URL, "footer")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>{APP.PROMO_NAME.toUpperCase()}</b>
            </a>
            <br />
            DADOS DA TABELA FIFA OFICIAL
            <br />
            <b>2026</b> · BRASIL HEXA (se Deus quiser)
          </div>
        </div>
        <div className="foot-bottom">
          <span>NÃO AFILIADO À FIFA · NEM ÀS EMISSORAS · NEM ÀS SELEÇÕES</span>
          <span>v0.1 · {APP.HASHTAG}</span>
        </div>
      </div>
    </footer>
  );
}
