// @ts-nocheck
"use client";
import { useState } from "react";
import { Video, Loader2, CheckCircle, Users, FileText, ListTodo, Copy } from "lucide-react";

const DEMO_TRANSCRIPT = `Javier: Buenos días a todos. El objetivo de hoy es revisar el pipeline de ventas y definir prioridades para esta semana.

María: Perfecto. Tenemos 8 leads calientes en Gran Canaria, principalmente hostelería y salud.

Javier: Bien. Necesito que María contacte los 5 mejores esta semana. Carlos, ¿puedes preparar las demos del bot de WhatsApp para el martes?

Carlos: Sin problema. Las tendré listas el lunes por la noche.

Javier: Tambiìn necesitamos activar 360Dialog antes del jueves. María, ¿puedes gestionarlo?

María: Sí, lo tramito mañana mismo.

Javier: Resumen: objetivo 3 clientes cerrados este mes. MRR actual 0, objetivo 1.500€ al final del mes.

María: Ninguna, todo claro.

Carlos: Confirmado.

Javier: Perfecto. Gracias a todos.`;

export default function MeetingsPage() {
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingTitle: title || "Reunión" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function copyTasks() {
    const text = result?.tasks?.map(t => `• ${t.person}: ${t.task} (${t.deadline || "sin fecha"})`).join("\n") || "";
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reuniones IA</h1>
        <p className="text-[#646878] mt-1">Pega la transcripción de tu reunión y Claude extrae resumen, decisiones y tareas automáticamente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: "💻", title: "Reunión online (Zoom/Meet/Teams)", desc: "Activa subtítulos automáticos → al terminar copia el texto y pégalo aquí." },
          { icon: "🎙️", title: "Reunión presencial", desc: "Usa Otter.ai (gratis) o Whisper en tu móvil para transcribir. Luego pega aquí." },
          { icon: "📝", title: "Texto o notas", desc: "Escribe o pega cualquier texto con lo que se habló en la reunión." },
        ].map((item, i) => (
          <div key={i} className="tryvor-card">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
            <p className="text-xs text-[#646878] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="tryvor-card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs text-[#646878] mb-1.5 block">Título (opcional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Reunión de ventas lunes"
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
          </div>
          <div className="flex-shrink-0 pt-5">
            <button onClick={() => setTranscript(DEMO_TRANSCRIPT)} className="text-xs text-[#00C8A0] hover:underline">
              Cargar demo →
            </button>
          </div>
        </div>
        <label className="text-xs text-[#646878] mb-1.5 block">Transcripción o notas</label>
        <textarea value={transcript} onChange={e => setTranscript(e.target.value)} rows={10}
          placeholder="Pega aquí la transcripción..."
          className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#00C8A0] outline-none resize-none mb-4 placeholder:text-[#646878]" />
        <div className="flex items-center gap-3">
          <button onClick={analyze} disabled={loading || transcript.trim().length < 20}
            className="tryvor-btn flex items-center gap-2 px-6 py-2.5 disabled:opacity-40">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            {loading ? "Analizando con IA..." : "Analizar reunión"}
          </button>
          {transcript && <span className="text-xs text-[#646878]">{transcript.length} caracteres</span>}
        </div>
        {error && <p className="text-red-400 text-sm mt-3">⚠️ {error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="tryvor-card">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#00C8A0]" />
              <h3 className="font-semibold text-white">Resumen ejecutivo</h3>
            </div>
            <p className="text-sm text-[#B4B8C6] leading-relaxed">{result.summary}</p>
          </div>
          {result.attendees?.length > 0 && (
            <div className="tryvor-card">
              <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-[#2A5FD4]" /><h3 className="font-semibold text-white">Asistentes</h3></div>
              <div className="flex flex-wrap gap-2">
                {result.attendees.map((a, i) => <span key={i} className="bg-[#1E2035] text-[#B4B8C6] px-3 py-1 rounded-full text-xs">{a}</span>)}
              </div>
            </div>
          )}
          {result.decisions?.length > 0 && (
            <div className="tryvor-card">
              <div className="flex items-center gap-2 mb-3"><CheckCircle className="w-4 h-4 text-[#D4A020]" /><h3 className="font-semibold text-white">Decisiones</h3></div>
              <ul className="space-y-1.5">
                {result.decisions.map((d, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#B4B8C6]"><span className="text-[#D4A020]">→</span>{d}</li>)}
              </ul>
            </div>
          )}
          {result.tasks?.length > 0 && (
            <div className="tryvor-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><ListTodo className="w-4 h-4 text-[#E05040]" /><h3 className="font-semibold text-white">Tareas</h3><span className="bg-[#E05040]/20 text-[#E05040] text-xs px-2 py-0.5 rounded-full">{result.tasks.length}</span></div>
                <button onClick={copyTasks} className="flex items-center gap-1.5 text-xs text-[#646878] hover:text-white">
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#00C8A0]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <div className="space-y-2">
                {result.tasks.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#1E2035] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#E05040]/20 flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-[#E05040]">{(t.person || "?").slice(0,2).toUpperCase()}</span></div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{t.person}</div>
                      <div className="text-sm text-[#B4B8C6] mt-0.5">{t.task}</div>
                      {t.deadline && <div className="text-xs text-[#646878] mt-1">📅 {t.deadline}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
