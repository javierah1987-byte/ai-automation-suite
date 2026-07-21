// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // reuniones más largas

// Transcripción REAL (Groq · Whisper large v3) + análisis a brief de requisitos (Groq · Llama 3.3 70B).
// Todo con UNA sola clave de Groq (gratis). Antes el resumen era SIMULADO y la analítica dependía de una clave Anthropic inválida.
// Antes: el resumen era SIMULADO (Claude se lo inventaba del título). Ahora escucha el audio de verdad.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const title = (formData.get("title") as string) || "Reunión";
    if (!audio) return NextResponse.json({ error: "No se recibió audio" }, { status: 400 });
    if (!process.env.GROQ_API_KEY)
      return NextResponse.json({ error: "Falta GROQ_API_KEY. Configúrala en Vercel para activar la transcripción real." }, { status: 501 });
    if (audio.size > 25 * 1024 * 1024)
      return NextResponse.json({ error: "El audio supera 25 MB (límite de Whisper). Graba reuniones más cortas o divídelas." }, { status: 413 });

    // 1) TRANSCRIPCIÓN REAL con Groq (Whisper large v3, endpoint compatible OpenAI)
    const wForm = new FormData();
    wForm.append("file", audio, audio.name || "meeting.webm");
    wForm.append("model", "whisper-large-v3");
    wForm.append("language", "es");
    wForm.append("response_format", "text");
    const wRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: wForm,
    });
    if (!wRes.ok) {
      const err = await wRes.text();
      return NextResponse.json({ error: "Error al transcribir: " + err.slice(0, 300) }, { status: 502 });
    }
    const transcript = (await wRes.text()).trim();
    if (!transcript) return NextResponse.json({ error: "La transcripción salió vacía (¿audio sin voz?)." }, { status: 422 });

    // 2) ANÁLISIS con Claude → BRIEF DE REQUISITOS fiel (para pasar al equipo de desarrollo)
    const prompt = `Eres analista de requisitos de software. A partir de la TRANSCRIPCIÓN de una reunión con un cliente (que explica qué software quiere que le construyan), extrae un BRIEF DE REQUISITOS fiel y accionable.

REGLAS:
- Usa SOLO lo que se dice en la transcripción. NO inventes nada. Lo que no se mencione, déjalo como null o lista vacía, y si es relevante anótalo en "dudas_pendientes".
- Responde ÚNICAMENTE con un JSON válido (sin texto alrededor, sin markdown).

Formato EXACTO del JSON:
{
  "cliente_proyecto": "nombre del cliente o del proyecto si se menciona, si no null",
  "summary": "resumen ejecutivo de la reunión, 3-5 frases",
  "objetivo": "el problema que el cliente quiere resolver o qué busca conseguir",
  "tipo_producto": "p.ej. web, app móvil, programa de gestión, TPV, CRM... o null",
  "funcionalidades": [{"nombre": "...", "prioridad": "imprescindible|deseable|opcional", "nota": "..."}],
  "usuarios_roles": ["..."],
  "integraciones": ["sistemas externos, APIs o plataformas mencionados"],
  "datos_entidades": ["entidades o datos clave que el software gestionará"],
  "restricciones": {"presupuesto": "o null", "plazo": "o null", "legal": "o null", "tecnicas": "o null"},
  "dudas_pendientes": ["cosas no aclaradas que habría que preguntar al cliente"],
  "decisiones": ["decisiones tomadas en la reunión"],
  "tasks": [{"person": "quién", "task": "qué", "deadline": "cuándo o null"}],
  "attendees": ["asistentes si se distinguen, si no vacío"]
}

TÍTULO DE LA REUNIÓN: "${title}"

TRANSCRIPCIÓN:
"""
${transcript}
"""`;

    const aRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2500,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const aJson = await aRes.json();
    if (!aRes.ok) return NextResponse.json({ error: "Error al analizar: " + JSON.stringify(aJson).slice(0, 300) }, { status: 502 });
    const text = aJson?.choices?.[0]?.message?.content || "{}";
    let data;
    try { data = JSON.parse(text.replace(/```json|```/g, "").trim()); }
    catch { data = { summary: transcript.slice(0, 600), tasks: [], attendees: [] }; }

    const durationMin = Math.max(1, Math.round(audio.size / 160000));
    return NextResponse.json({ ...data, title, transcript, duration_minutes: durationMin, processed: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
