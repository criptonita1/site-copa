/**
 * Roda no prebuild. Gera 3 QR codes SVG estáticos em public/qr/.
 * Não é runtime — biblioteca QR fica fora do bundle do cliente.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import QRCode from "qrcode";
import { SUPPORT } from "../src/config";
import { buildPixPayload } from "../src/lib/pix";

const OUT_DIR = resolve(process.cwd(), "public/qr");
mkdirSync(OUT_DIR, { recursive: true });

const qrOpts = {
  type: "svg" as const,
  errorCorrectionLevel: "M" as const,
  margin: 1,
  color: { dark: "#0d0d0d", light: "#f4e9d4" }, // ink sobre paper — combina com Footer
};

async function main() {
  const pixPayload = buildPixPayload({
    key: SUPPORT.PIX.KEY,
    name: SUPPORT.PIX.NAME,
    city: SUPPORT.PIX.CITY,
  });

  // Deep-link URIs: scan/tap em mobile abre wallet com endereço pré-preenchido.
  const ethUri = `ethereum:${SUPPORT.ETH.ADDRESS}`; // EIP-681
  const solUri = `solana:${SUPPORT.SOL.ADDRESS}`; // Solana Pay

  const [pix, eth, sol] = await Promise.all([
    QRCode.toString(pixPayload, qrOpts),
    QRCode.toString(ethUri, qrOpts),
    QRCode.toString(solUri, qrOpts),
  ]);

  writeFileSync(resolve(OUT_DIR, "pix.svg"), pix);
  writeFileSync(resolve(OUT_DIR, "eth.svg"), eth);
  writeFileSync(resolve(OUT_DIR, "sol.svg"), sol);

  console.log("✓ QR codes gerados em public/qr/ (pix, eth, sol)");
}

main().catch((e) => {
  console.error("Falha gerando QR codes:", e);
  process.exit(1);
});
