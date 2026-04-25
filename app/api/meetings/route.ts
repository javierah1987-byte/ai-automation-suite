// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  try {
    const { transcript, meetingTitle } = await req.json();
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1500,
      messages: [{ role: "user", content: `Analiza esta transcripción de reunión y extrae información clave. Responde SOLO con JSON vālido.\nTITULO: ${meetingTitle||"Reunión"}\nTRANSCRIPCIÓN:\n${transcript}\n\nFormato: {\"summary\":\"...\",\"attendees\":[],\"decisions\":[],\"tasks\":[{\"person\":\"\",\"task\":\"\",\"deadline\":\"\"}]}` }]
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "{}";
    let data; try { data = JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { data = { summary: text, attendees: [], decisions: [], tasks: [] }; }
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
