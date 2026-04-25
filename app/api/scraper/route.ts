// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
function generateMockLeads(sector, zone, limit) {
  const names = Array.from({ length: 10 }, (_, i) => `${sector} ${zone} ${i+1}`);
  const streets = ["Calle Mayor","Av. Las Palmas","C/ del Mar","Paseo Marítimo"];
  return Array.from({ length: Math.min(limit,40) }, (_, i) => ({
    name: names[i%names.length], address: `${streets[i%streets.length]} ${i+1}, ${zone}`,
    phone: `+34 600 ${Math.floor(Math.random()*900)+100} ${Math.floor(Math.random()*900)+100}`,
    website: Math.random()>0.4 ? `www.${sector}${i}.es` : "",
    rating: +(3.5+Math.random()*1.5).toFixed(1), reviews: Math.floor(5+Math.random()*200), score: 0, sector
  }));
}
export async function POST(req: NextRequest) {
  try {
    const { sector, zone, limit = 50 } = await req.json();
    const leads = generateMockLeads(sector, zone, limit);
    const leadsText = leads.map((l, i) => `${i+1}. ${l.name} | Rating: ${l.rating} | Reviews: ${l.reviews} | Web: ${l.website ? "sí" : "no"}`).join("\n");
    const scoreRes = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1000,
      messages: [{ role: "user", content: `Evalúa estos negocios del sector "${sector}" en "${zone}" y asigna un score 0-10. Responde SOLO con array JSON de números: [8,6,9...]\n${leadsText}` }]
    });
    const text = scoreRes.content[0].type === "text" ? scoreRes.content[0].text : "[]";
    let scores = []; try { const m = text.match(/\[[\d,\s]+\]/); if (m) scores = JSON.parse(m[0]); } catch {}
    const scoredLeads = leads.map((l, i) => ({ ...l, score: scores[i] || Math.floor(5+Math.random()*5) })).sort((a,b) => b.score-a.score);
    return NextResponse.json({ leads: scoredLeads, total: scoredLeads.length });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
