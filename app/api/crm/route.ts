// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { csv } = await req.json();
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [{ role: "user", content: `Analiza este CSV y normaliza contactos para CRM. Responde SOLO JSON: {imported:N,fixed:N,skipped:N,contacts:[{name:"",phone:null,company:null,email:null,city:null,notes:null}]}\nCSV:\n${csv}` }]
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "{}";
    let data; try { data = JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { data = {imported:0,fixed:0,skipped:0,contacts:[]}; }
    return NextResponse.json(data);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
