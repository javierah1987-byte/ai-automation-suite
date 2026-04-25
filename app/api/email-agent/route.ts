// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  try {
    const { email, tone, name } = await req.json();
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 400,
      messages: [{ role: "user", content: `Eres el asistente de email de ${name} (Tryvor, automatización IA en Canarias).\nEmail:\nDe: ${email.from}\nAsunto: ${email.subjuect}\nCuerpo: ${email.body}\nRedacta un borrador de respuesta con tono "${tone}". Máx 50 palabras. Firma como "${name} · Tryvor".` }]
    });
    const draft = res.content[0].type === "text" ? res.content[0].text : "";
    return NextResponse.json({ draft });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
