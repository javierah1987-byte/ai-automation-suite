// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, businessName, businessInfo, history = [] } = await req.json();
    const historyText = history.slice(-6).map((m: any) => `${m.role === "user" ? "Cliente" : "Bot"}: ${m.text}`).join("\n");
    const res = await anthropic.messages.create({ model: "claude-sonnet-4-5-20250929", max_tokens: 300, messages: [{ role: "user", content: `Eres el asistente virtual de WhatsApp del negocio "${businessName}".\nINFO: ${businessInfo}\nHISTORIAL: ${historyText}\nMENSAJE: ${message}\nResponde amable, breve (máx 3 frases), en spañol. NO inventes datos.` }] });
    return NextResponse.json({ reply: res.content[0].type === "text" ? res.content[0].text : "Gracias." });
  } catch (e: any) { return NextResponse.json({ reply: "Disculpa, error técnico. Llámanos directamente." }); }
}
