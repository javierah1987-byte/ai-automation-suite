// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { transcript, meetingTitle } = await req.json();
    if (!transcript || transcript.trim().length < 50) {
      return NextResponse.json({ error: "La transcripción es demasiado corta. Necesitas al menos 50 caracteres." }, { status: 400 });
    }
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", max_tokens: 1500,
      messages: [{ role: "user", content: `Analiza esta transcripción "${meetingTitle || 'Reunión'}" y extrae información. Responde SOLO con JSON: {summary:"",attendees:[],decisions:[],tasks:[{person:"",task:"",deadline:""}]}\nTRANSCRIPCIÓN:\n${transcript}` }]
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "{}";
    let data; try { data = JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { data = { summary: text, attendees: [], decisions: [], tasks: [] }; }
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
