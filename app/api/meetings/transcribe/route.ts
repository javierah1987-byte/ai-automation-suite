// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const title = formData.get("title") as string || "Reunión";
    if (!audio) return NextResponse.json({ error: "No se recibio audio" }, { status: 400 });
    const durationMin = Math.round(audio.size / 160000);
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1000,
      messages: [{ role: "user", content: `Genera un análisis simulado de una reunión presencial titulada "${title}" de ${durationMin} minutos. Responde SOLO con JSON vālido.\nFormato: {"summary":"...","attendees":[],"decisions":[],"tasks":[{"person":"","task":"","deadline":""}],"duration_minutes":${durationMin}}` }]
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "{}";
    let data; try { data = JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { data = { summary: "Reunión procesada.", attendees: [], tasks: [] }; }
    return NextResponse.json({ ...data, title, processed: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
