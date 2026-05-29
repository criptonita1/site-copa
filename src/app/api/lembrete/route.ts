import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  email: z.string().email().max(200),
  // honeypot — deve vir vazio
  company: z.string().max(0).optional().or(z.literal("")),
});

/**
 * ⚠️ SECURITY NOTE (audit 2026-05-29):
 *
 * 1) Rate-limit em-memory neste isolate só funciona em escala BAIXA. Em prod
 *    multi-region, cada isolate Vercel tem seu próprio Map → atacante distribui
 *    e fura. Migrar pra @upstash/redis assim que tráfego virar real (~100 req/min).
 *    Ver CLAUDE.md → "Próximas ações pendentes".
 *
 * 2) RESEND_API_KEY hoje tem "Full Access". Se vazar, atacante pode tudo na
 *    Resend (criar domínios, deletar audiences, spam). Reduzir escopo pra
 *    "Custom: contacts.write" assim que possível (5 min no dashboard Resend).
 *
 * 3) IP source: preferimos NextRequest.ip (sanitizado pela Vercel) e caímos
 *    pra x-forwarded-for SÓ se ip indefinido (dev/preview). Em outras
 *    plataformas que não sanitizam, forçar fallback é necessário.
 */
const requestsByIp = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const existing = requestsByIp.get(ip) ?? [];
  // poda timestamps velhos
  const fresh = existing.filter((t) => t > cutoff);
  if (fresh.length >= MAX_PER_WINDOW) {
    requestsByIp.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  requestsByIp.set(ip, fresh);

  // GC: limpa entradas antigas pra não crescer indefinidamente
  if (requestsByIp.size > 1000) {
    for (const [k, v] of requestsByIp) {
      if (v.every((t) => t < cutoff)) requestsByIp.delete(k);
    }
  }
  return false;
}

/**
 * IP source com defesa em profundidade:
 *  1. NextRequest.ip — populado pela Vercel após sanitização (preferido)
 *  2. x-real-ip — segundo melhor (também sanitizado pela Vercel)
 *  3. x-forwarded-for[0] — pode ser spoofed em plataformas sem proxy trust
 *  4. "unknown" — sentinela final
 *
 * Em Vercel, opções 1 e 2 são confiáveis. Em outros providers, validar.
 */
function resolveIp(req: NextRequest): string {
  if (req.ip) return req.ip;
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && /^[0-9a-f.:]+$/i.test(first)) return first;
  }
  return "unknown";
}

/**
 * Trace ID curto pra correlacionar log de erro com request específico
 * sem dependência de PII. 8 chars hex random — colisão desprezível
 * pra debug (~4 bilhões por 64k requests).
 */
function makeTraceId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  const trace = makeTraceId();
  const ip = resolveIp(req);

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: true }, { status: 200 }); // silencioso
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success || parsed.data.company) {
    // honeypot preenchido OU email inválido — fingimos sucesso
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.RESEND_FROM;

  // Sem API key configurada — UX já mostrou ok, log SEM email (LGPD)
  if (!apiKey) {
    console.warn(`[lembrete trace=${trace}] RESEND_API_KEY ausente — lead não persistido`);
    return NextResponse.json({ ok: true });
  }

  // Sanity check do FROM (precisa ter pelo menos um @ válido)
  // Não bloqueia a operação — Resend pode usar default — mas loga warning
  if (from && !/^.+<.+@.+\..+>$|^.+@.+\..+$/.test(from)) {
    console.warn(`[lembrete trace=${trace}] RESEND_FROM mal formatado — verifique env var`);
  }

  try {
    const resend = new Resend(apiKey);
    if (audienceId) {
      const result = await resend.contacts.create({
        email: parsed.data.email,
        audienceId,
        unsubscribed: false,
      });
      if (result.error) {
        // Resend retornou erro mas não threw — captura
        console.error(
          `[lembrete trace=${trace}] resend error:`,
          result.error.name,
          result.error.message,
        );
      } else {
        // sucesso — log SEM email (LGPD), só ID do contato criado
        console.log(
          `[lembrete trace=${trace}] contato criado id=`,
          result.data?.id ?? "?",
        );
      }
    } else {
      // Sem audience em prod: criar uma no Resend dashboard ou salvar em KV/DB.
      // Log sem email (LGPD).
      console.warn(
        `[lembrete trace=${trace}] sem RESEND_AUDIENCE_ID — lead recebido mas não persistido`,
      );
    }
  } catch (err) {
    // Log do erro SEM o email (LGPD)
    const msg = err instanceof Error ? err.message : "unknown";
    console.error(`[lembrete trace=${trace}] resend falhou (throw):`, msg);
    // Não derruba UX
  }

  return NextResponse.json({ ok: true });
}
