import { NextResponse } from "next/server";
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
 * Rate-limit por-IP. Cada IP guarda uma lista de timestamps de requests
 * dentro da janela. Edge isolates compartilham o Map enquanto vivos,
 * então é "best effort" — pra escala viral real, trocar por @upstash/ratelimit
 * + Vercel KV (TODO documentado em STACK.md).
 *
 * Fix do audit: a versão anterior usava chave composta `${ip}:${now}` e nunca
 * limitava por IP, só contava o total global — ataque de 1 IP afetava todos.
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

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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

  // Sem API key configurada — UX já mostrou ok, log SEM email (LGPD)
  if (!apiKey) {
    console.warn("[lembrete] RESEND_API_KEY ausente — lead não persistido");
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    if (audienceId) {
      await resend.contacts.create({
        email: parsed.data.email,
        audienceId,
        unsubscribed: false,
      });
    } else {
      // Sem audience em prod: criar uma no Resend dashboard ou salvar em KV/DB.
      // Log sem email (LGPD).
      console.warn("[lembrete] sem RESEND_AUDIENCE_ID — lead recebido mas não persistido");
    }
  } catch (err) {
    // Log do erro SEM o email (LGPD)
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[lembrete] resend falhou:", msg);
    // Não derruba UX
  }

  return NextResponse.json({ ok: true });
}
