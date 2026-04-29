// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, businessName, businessInfo, history = [] } = await req.json();
    console.log("KEY_EXISTS:", !!process.env.ANTHROPIC_API_KEY);
    console.log("KEY_PREFIX:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 300,
      messages: [{ role: "user", content: `Eres asistente de ${businessName}. ${businessInfo}. Cliente: ${message}. Responde breve en español.` }]
    });
    const reply = res.content[0].type === "text" ? res.content[0].text : "Gracias.";
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error("WA_ERROR:", JSON.stringify({msg: e.message, status: e.status, errType: e.error?.type}));
    return NextResponse.json({ reply: "ERR:" + e.message.slice(0,100) });
  }
}
