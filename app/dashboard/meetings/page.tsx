// @ts-nocheck
"use client";
import { useState } from "react";
import { Video, Loader2, CheckCircle, Users, FileText, ListTodo, Copy } from "lucide-react";

const DEMO = `Javier: Buenos dias. Revisamos pipeline de ventas.
Maria: 8 leads calientes en Gran Canaria.
Javier: Maria contacta los 5 mejores esta semana. Carlos prepara demos WhatsApp para el martes.
Carlos: Listas el lunes.
Maria: Activo 360Dialog el jueves.
Javier: Objetivo 3 clientes este mes. MRR 1.500. Gracias.`;

export default function MeetingsPage() {
  const [transcript, setT] = useState(""), [title, setTitle] = useState(""), [loading, setL] = useState(false), [result, setR] = useState<any>(null), [error, setE] = useState(""), [copied, setC] = useState(false);

  async function analyze() {
    setL(true); setE(""); setR(null);
    try {
      const res = await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, meetingTitle: title || "Reunion" }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setR(data);
    } catch (e: any) { setE(e.message); } finally { setL(false); }
  }

  function copyTasks() {
    navigator.clipboard.writeText(result?.tasks?.map((t: any) => `- ${t.person}: ${t.task}`).join("\n") || "");
    setC(true); setTimeout(() => setC(false), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reuniones IA</h1>
        <p className="text-[#646878] mt-1">Pega la transcripcion de tu reunion y Claude extrae resumen, decisiones y tareas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[{icon:"💻",t:"Zoom/Meet/Teams",d:"Activa subtitulos > copia el texto y pegalo abajo."},{icon:"🎙️",t:"Presencial",d:"Usa Otter.ai o Whisper en tu movil. Luego pega aqui."},{icon:"📝",t:"Texto o notas",d:"Pega cualquier texto de lo que se hablo en la reunion."}].map((item,i) => (
          <div key={i} className="tryvor-card"><div className="text-2xl mb-2">{item.icon}</div><div className="font-semibold text-white text-sm mb-1">{item.t}</div><p className="text-xs text-[#646878]">{item.d}</p></div>
        ))}
      </div>
      <div className="tryvor-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titulo de la reunion (opcional)" className="flex-1 mr-4 bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
          <button onClick={() => setT(DEMO)} className="text-xs text-[#00C8A0] hover:underline whitespace-nowrap">Cargar demo →</button>
        </div>
        <textarea value={transcript} onChange={e => setT(e.target.value)} rows={10} placeholder="Pega aqui la transcripcion..." className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#00C8A0] outline-none resize-none mb-4 placeholder:text-[#646878]" />
        <div className="flex items-center gap-3">
          <button onClick={analyze} disabled={loading || transcript.trim().length < 20} className="tryvor-btn flex items-center gap-2 px-6 py-2.5 disabled:opacity-40">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            {loading ? "Analizando con IA..." : "Analizar reunion"}
          </button>
          {transcript && <span className="text-xs text-[#646878]">{transcript.length} caracteres</span>}
        </div>
        {error && <p className="text-red-400 text-sm mt-3">⚠️ {error}</p>}
      </div>
      {result && (
        <div className="space-y-4">
          <div className="tryvor-card"><div className="flex items-center gap-2 mb-3"><FileText className="w-4 h-4 text-[#00C8A0]" /><h3 className="font-semibold text-white">Resumen</h3></div><p className="text-sm text-[#B4B8C6] leading-relaxed">{result.summary}</p></div>
          {result.tasks?.length > 0 && (
            <div className="tryvor-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><ListTodo className="w-4 h-4 text-[#E05040]" /><h3 className="font-semibold text-white">Tareas</h3><span className="bg-[#E05040]/20 text-[#E05040] text-xs px-2 py-0.5 rounded-full">{result.tasks.length}</span></div>
                <button onClick={copyTasks} className="flex items-center gap-1.5 text-xs text-[#646878] hover:text-white">{copied ? <CheckCircle className="w-3.5 h-3.5 text-[#00C8A0]" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copiado" : "Copiar"}</button>
              </div>
              <div className="space-y-2">
                {result.tasks.map((t: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#1E2035] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#E05040]/20 flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-[#E05040]">{(t.person||"?").slice(0,2).toUpperCase()}</span></div>
                    <div><div className="text-sm text-white font-medium">{t.person}</div><div className="text-sm text-[#B4B8C6]">{t.task}</div>{t.deadline && <div className="text-xs text-[#646878] mt-1">📅 {t.deadline}</div>}</div>
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
