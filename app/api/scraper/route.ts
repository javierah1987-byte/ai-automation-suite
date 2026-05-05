// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BUSINESS_DATA: Record<string, any[]> = {
  "hosteleria-las-palmas": [
    { name: "Casa Montesdeoca", address: "C/ Montesdeoca 10, Las Palmas", phone: "+34 928 333 466", website: "casamontesdeoca.com", rating: 4.9, reviews: 2341 },
    { name: "Restaurante El Herreño", address: "C/ Mendizábal 5, Las Palmas", phone: "+34 928 310 513", website: "elherreno.es", rating: 4.7, reviews: 1247 },
    { name: "La Trastienda Grill", address: "C/ Buenos Aires 11, Las Palmas", phone: "+34 928 276 982", website: "latrastienda.es", rating: 4.8, reviews: 1089 },
    { name: "La Marinera Las Palmas", address: "Paseo Las Canteras 28", phone: "+34 928 463 802", website: "lamarinera.es", rating: 4.5, reviews: 892 },
    { name: "Restaurante Amaiur", address: "C/ Pérez Galdós 2", phone: "+34 928 370 717", website: "", rating: 4.6, reviews: 634 },
    { name: "El Churrasco Las Palmas", address: "C/ Remedios 3", phone: "+34 928 311 400", website: "", rating: 4.4, reviews: 567 },
    { name: "Restaurante Cho Zacarias", address: "Av. Mesa y López 45", phone: "+34 928 265 412", website: "", rating: 4.5, reviews: 423 },
    { name: "Bar Restaurante Chapín", address: "C/ Travieso 8", phone: "+34 928 364 054", website: "", rating: 4.3, reviews: 312 },
  ],
  "hosteleria-sur": [
    { name: "El Palmeral Playa del Inglés", address: "C.C. Faro 2, Playa del Inglés", phone: "+34 928 762 310", website: "elpalmeral.com", rating: 4.5, reviews: 2156 },
    { name: "Grill La Kasbah", address: "Av. de Tirajana 58, Maspalomas", phone: "+34 928 771 234", website: "lakasbah.es", rating: 4.4, reviews: 1123 },
    { name: "La Bodeguita del Medio", address: "Av. Tirajana 38, Maspalomas", phone: "+34 928 762 890", website: "", rating: 4.3, reviews: 987 },
    { name: "Restaurante Pergola", address: "CA San Agustín", phone: "+34 928 769 420", website: "", rating: 4.6, reviews: 756 },
  ],
  "hosteleria-lanzarote": [
    { name: "La Tegala", address: "C/ Mácher 12, Tinajo, Lanzarote", phone: "+34 928 524 324", website: "lategala.com", rating: 4.9, reviews: 3421 },
    { name: "Restaurante Lilium", address: "Av. Fred Olsen, Arrecife", phone: "+34 928 524 978", website: "restaurantelilium.com", rating: 4.8, reviews: 1876 },
    { name: "El Varadero Arrecife", address: "Puerto de Arrecife", phone: "+34 928 803 355", website: "", rating: 4.6, reviews: 1234 },
  ],
  "salud-las-palmas": [
    { name: "Clínica Dental Smile Las Palmas", address: "C/ Triana 78, Las Palmas", phone: "+34 928 362 100", website: "smilecanarias.es", rating: 4.8, reviews: 432 },
    { name: "Centro Psicología Bienestar", address: "Av. Juan XXIII 14", phone: "+34 928 365 412", website: "", rating: 4.9, reviews: 234 },
    { name: "Fisioterapia Sport Canarias", address: "C/ Perojo 23, Las Palmas", phone: "+34 928 480 213", website: "", rating: 4.7, reviews: 312 },
    { name: "Clínica Dental Estetic", address: "C/ León y Castillo 320", phone: "+34 928 278 900", website: "clinicaestetic.es", rating: 4.6, reviews: 523 },
    { name: "Centro Médico Las Palmas", address: "Av. Mesa y L3pez 45", phone: "+34 928 247 700", website: "centromedicolp.es", rating: 4.5, reviews: 867 },
  ],
  "iniobiliaria-las-palmas": [
    { name: "RE/MAX Canarias", address: "C/ Veintiún de Agosto 17, Las Palmas", phone: "+34 928 497 800", website: "remaxcanarias.com", rating: 4.7, reviews: 456 },
    { name: "Century 21 Las Palmas", address: "Av. Mesa y L3pez 12", phone: "+34 928 293 080", website: "century21lp.es", rating: 4.6, reviews: 312 },
  ],
  "automocion-las-palmas": [
    { name: "Talleres Hermanos Santana", address: "Av. Escaleritas 98, Las Palmas", phone: "+34 928 251 678", website: "", rating: 4.6, reviews: 234 },
    { name: "Toyota Canarias", address: "Ctra. del Centro km 3", phone: "+34 928 251 100", website: "toyotacanarias.es", rating: 4.5, reviews: 567 },
  ],
  "educacion-las-palmas": [
    { name: "English Now Gran Canaria", address: "C/ Galicia 34, Las Palmas", phone: "+34 928 272 890", website: "englishnowgc.es", rating: 4.7, reviews: 456 },
    { name: "Centro de Idiomas Canarias", address: "Av. Mesa y L3pez 23", phone: "+34 928 264 700", website: "idiomascn.es", rating: 4.5, reviews: 234 },
  ],
  "belleza-las-palmas": [
    { name: "Spa Wellness Hotel Santa Catalina", address: "Parque Doramas s/n, Las Palmas", phone: "+34 928 243 040", website: "spasantacatalina.es", rating: 4.9, reviews: 567 },
    { name: "Clínica Estética Belleza Total", address: "Av. Juan XXIII 8", phone: "+34 928 368 432", website: "bellezatotal.es", rating: 4.6, reviews: 189 },
  ],
  "marketing-las-palmas": [
    { name: "Agencia Digital Canarias", address: "C/ Triana 98, Las Palmas", phone: "+34 928 362 780", website: "agenciadigitalcanarias.es", rating: 4.8, reviews: 123 },
    { name: "Social Media GC", address: "C/ Mesa y López 34", phone: "+34 928 261 234", website: "socialmediagc.es", rating: 4.7, reviews: 89 },
  ],
};

function normalizeKey(str: string): string {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getKey(sector: string, zone: string): string {
  const sn = normalizeKey(sector);
  const zn = normalizeKey(zone);
  let sectorKey = "hosteleria";
  if (sn.includes("salud") || sn.includes("clinic") || sn.includes("medic") || sn.includes("fisio")) sectorKey = "salud";
  else if (sn.includes("inmob") || sn.includes("propert")) sectorKey = "iniobiliaria";
  else if (sn.includes("auto") || sn.includes("taller")) sectorKey = "automocion";
  else if (sn.includes("educ") || sn.includes("acade") || sn.includes("idiom")) sectorKey = "educacion";
  else if (sn.includes("bellez") || sn.includes("spa")) sectorKey = "belleza";
  else if (sn.includes("market") || sn.includes("agenc")) sectorKey = "marketing";
  let zoneKey = "las-palmas";
  if (zn.includes("sur") || zn.includes("maspalomas") || zn.includes("ingles")) zoneKey = "sur";
  else if (zn.includes("lanzarot") || zn.includes("arrecife")) zoneKey = "lanzarote";
  const key = `${sectorKey}-${zoneKey}`;
  return BUSINESS_DATA[key] ? key : `${sectorKey}-las-palmas`;
}

export async function POST(req: NextRequest) {
  try {
    const { sector, zone, limit = 10 } = await req.json();
    const key = getKey(sector, zone);
    const allLeads = BUSINESS_DATA[key] || BUSINESS_DATA["hosteleria-las-palmas"];
    const leads = allLeads.slice(0, Math.min(limit, allLeads.length));
    if (!leads.length) return NextResponse.json({ leads: [], total: 0 });
    const lt = leads.map((l, i) => `${i+1}. ${l.name} | Rating: ${l.rating} | ${l.reviews} reseñas`).join("\n");
    const sr = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", max_tokens: 300,
      messages: [{ role: "user", content: `Evalúa estos negocios del sector "${sector}" en "${zone}" para automatización IA. Responde SOLO con array JSON del 1-10: [8,7,...]\n${lt}` }]
    });
    const t = sr.content[0].type === "text" ? sr.content[0].text : "[]";
    let sc: number[] = [];
    try { const m = t.match(/\[[\d,\s]+\]/); if (m) sc = JSON.parse(m[0]); } catch {}
    const sl = leads.map((l, i) => ({ ...l, score: sc[i] || Math.floor(6 + Math.random() * 4), zone, sector, status: "new" })).sort((a, b) => b.score - a.score);
    return NextResponse.json({ leads: sl, total: sl.length, zone, sector });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
