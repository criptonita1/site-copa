/**
 * Gera o BR Code Pix (EMV / "copia-e-cola") a partir de uma chave.
 * Pura — usado tanto pelo script de prebuild (gera o QR SVG estático)
 * quanto pelo componente client (botão copiar copia-e-cola).
 *
 * Referência: Manual de Padrões para Iniciação do Pix — Bacen.
 */

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function crc16ccitt(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface PixInput {
  key: string;
  name: string; // max 25 chars, caixa alta sem acento
  city: string; // max 15 chars, caixa alta sem acento
}

export function buildPixPayload({ key, name, city }: PixInput): string {
  const merchantAccount = tlv("26", tlv("00", "BR.GOV.BCB.PIX") + tlv("01", key));
  const additional = tlv("62", tlv("05", "***"));

  const payload =
    tlv("00", "01") +
    merchantAccount +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("58", "BR") +
    tlv("59", name) +
    tlv("60", city) +
    additional +
    "6304";

  return payload + crc16ccitt(payload);
}
