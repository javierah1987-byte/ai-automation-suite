// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  try {
    const { clientName, clientCompany, clientEmail, sector, service, budget, deadline, notes, brandName } = await req.json();
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1500,
      messages: [{ role: "user", content: `Eres un experto consultor IA en España. Redacta una propuesta comercial profesional para:\nNombre: ${clientName}\nEmpresa: ${clientCompany}\nSector: ${sector}\nServicio: ${service}\nPresupuesto: ${budget||"A definir"}\nPlazo: ${deadline||"A definir"}\nNotas: ${notes||"Ninguna"}\nEmpresa proponente: ${brandName||"Tryvor"}\nTono: profesional pero cercano. Máx 400 palabras. Sin markdown.` }]
    });
    const proposal = res.content[0].type === "text" ? res.content[0].text : "";
    return NextResponse.json({ proposal, clientEmail });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
