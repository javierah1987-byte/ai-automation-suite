// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { email, tone, name } = await req.json();
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 400,
      messages: [{ role: "user", content: `Eres asistente de email de ${name} (Tryvor).\nEmail: De ${email.from} Asunto: ${email.subject}\n${email.body}\nRedacta respuesta tono "${tone}", máx 150 palabras. Firma: ${name} · Tryvor` }]
    });
    const draft = res.content[0].type === "text" ? res.content[0].text : "";
    return NextResponse.json({ draft });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
