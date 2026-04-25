// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function GET(req: NextRequest) {
  const challenge = new URL(req.url).searchParams.get("hub.challenge");
  if (challenge) return new Response(challenge, { status: 200 });
  return NextResponse.json({ status: "webhook active" });
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages || [];
    if (!messages.length) return NextResponse.json({ status: "no messages" });
    for (const msg of messages) {
      if (msg.type !== "text") continue;
      const from = msg.from, text = msg.text?.body || "";
      const businessName = process.env.WHATSAPP_BUSINESS_NAME || "negocio";
      const businessInfo = process.env.WHATSAPP_BUSINESS_INFO || "";
      const res = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514", max_tokens: 200,
        messages: [{ role: "user", content: `Eres el asistente de WhatsApp de "${businessName}". INFO: ${businessInfo}. MENSAJE: ${text}. Responde breve en español.` }]
      });
      const reply = res.content[0].type === "text" ? res.content[0].text : "Gracias";
      if (process.env.DIALNET360_API_KEY) {
        await fetch("https://waba.360dialog.io/v1/messages", { method: "POST", headers: { "D360-API-KEY": process.env.DIALNET360_API_KEY!, "Content-Type": "application/json" }, body: JSON.stringify({ to: from, type: "text", text: { body: reply } }) });
      }
    }
    return NextResponse.json({ status: "processed" });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
