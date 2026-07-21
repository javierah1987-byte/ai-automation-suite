// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, Video, Loader2, CheckCircle, FileText, ListTodo, Copy, Square } from "lucide-react";

const DEMO_TRANSCRIPT = `Javier: Buenos dias. Revisamos pipeline de ventas.
Maria: 8 leads calientes en Gran Canaria.
Javier: Maria contacta los 5 mejores esta semana. Carlos prepara demos WhatsApp para el martes.
Carlos: Listas el lunes.
Maria: Activo 360Dialog el jueves.
Javier: Objetivo 3 clientes este mes. MRR 1.500. Gracias.`;

export default function MeetingsPage() {
  const [transcript, setT] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [recErr, setRecErr] = useState("");
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  async function startRecording() {
    setRecErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        await transcribeAudio(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
      mr.start(1000);
      mrRef.current = mr;
      setRecording(true); setRecTime(0);
      timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
    } catch (e) { setRecErr("No se pudo acceder al microfono. Permite el acceso en tu navegador."); }
  }

  function stopRecording() {
    if (mrRef.current && recording) {
      mrRef.current.stop(); setRecording(false); clearInterval(timerRef.current);
    }
  }

  async function transcribeAudio(blob) {
    setTranscribing(true); setRecErr("");
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      try {
        const b64 = reader.result.split(",")[1];
        const res = await fetch("/api/meetings/transcribe", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: b64, mimeType: "audio/webm" }),
        });
        const d = await res.json();
        if (d.transcript) setT(pr => pr ? pr + "\n\n" + d.transcript : d.transcript);
        if (d.error) setRecErr(d.error);
      } catch (e) { setRecErr("Error: " + e.message); }
      finally { setTranscribing(false); }
    };
  }

  function fmt(s) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`; }

  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingTitle: title || "Reunion" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function copyTasks() {
    // Copia el BRIEF COMPLETO en markdown (para pegárselo al equipo de desarrollo / a Nexa).
    const r = result || {};
    const L = [];
    L.push(`# Brief de reunión${r.cliente_proyecto ? " — " + r.cliente_proyecto : ""}`);
    if (r.title) L.push(`**Reunión:** ${r.title}`);
    if (r.summary) L.push(`\n## Resumen\n${r.summary}`);
    if (r.objetivo) L.push(`\n## Objetivo\n${r.objetivo}`);
    if (r.tipo_producto) L.push(`\n**Tipo de producto:** ${r.tipo_producto}`);
    if (r.funcionalidades?.length) L.push(`\n## Funcionalidades\n${r.funcionalidades.map(f => `- [${f.prioridad || "?"}] ${f.nombre}${f.nota ? " — " + f.nota : ""}`).join("\n")}`);
    if (r.usuarios_roles?.length) L.push(`\n**Usuarios/roles:** ${r.usuarios_roles.join(", ")}`);
    if (r.integraciones?.length) L.push(`\n**Integraciones:** ${r.integraciones.join(", ")}`);
    if (r.datos_entidades?.length) L.push(`\n**Datos/entidades:** ${r.datos_entidades.join(", ")}`);
    const rc = r.restricciones || {};
    const rcL = Object.entries(rc).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
    if (rcL.length) L.push(`\n**Restricciones:** ${rcL.join(" · ")}`);
    if (r.dudas_pendientes?.length) L.push(`\n## Dudas por aclarar\n${r.dudas_pendientes.map(d => `- ${d}`).join("\n")}`);
    if (r.decisiones?.length) L.push(`\n## Decisiones\n${r.decisiones.map(d => `- ${d}`).join("\n")}`);
    if (r.tasks?.length) L.push(`\n## Tareas\n${r.tasks.map(t => `- ${t.person}: ${t.task} (${t.deadline || "sin fecha"})`).join("\n")}`);
    navigator.clipboard.writeText(L.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reuniones IA</h1>
        <p className="text-[#646878] mt-1">Graba tu reunion directamente o pega la transcripcion. Claude extrae resumen, decisiones y tareas.</p>
      </div>

      <div className="tryvor-card mb-5" style={{ borderColor: "#00C8A033" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#00C8A0]/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-[#00C8A0]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Grabador de audio integrado</h3>
            <p className="text-xs text-[#646878]">Graba directamente desde este dispositivo — transcripcion automatica con IA</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap mb-3">
          {!recording && !transcribing && (
            <button onClick={startRecording} className="flex items-center gap-2 bg-[#E05040] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
              <Mic className="w-4 h-4" /> Iniciar grabacion
            </button>
          )}
          {recording && (
            <>
              <button onClick={stopRecording} className="flex items-center gap-2 bg-[#E05040] text-white px-5 py-2.5 rounded-xl font-medium text-sm">
                <Square className="w-4 h-4" /> Parar grabacion
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E05040] animate-pulse" />
                <span className="text-sm text-white font-semibold">{fmt(recTime)}</span>
                <span className="text-xs text-[#646878]">grabando...</span>
              </div>
            </>
          )}
          {transcribing && (
            <div className="flex items-center gap-2 text-[#00C8A0] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Transcribiendo con IA...
            </div>
          )}
        </div>
        {recErr && <p className="text-red-400 text-xs mt-2">{recErr}</p>}
        <div className="p-3 bg-[#0A0C16] rounded-lg">
          <p className="text-xs text-[#646878]">
            Pulsa <span className="text-white">"Iniciar grabacion"</span> → habla con tu equipo → pulsa <span className="text-white">"Parar"</span> → Claude transcribe automaticamente → pulsa <span className="text-white">"Analizar reunion"</span>
          </p>
        </div>
      </div>

      <div className="tryvor-card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs text-[#646878] mb-1.5 block">Titulo (opcional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Reunion ventas lunes"
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
          </div>
          <button onClick={() => setT(DEMO_TRANSCRIPT)} className="flex-shrink-0 mt-5 text-xs text-[#00C8A0] hover:underline whitespace-nowrap">
            Cargar demo
          </button>
        </div>
        <label className="text-xs text-[#646878] mb-1.5 block">
          Transcripcion {transcript && <span className="text-[#00C8A0]">({transcript.length} caracteres)</span>}
        </label>
        <textarea value={transcript} onChange={e => setT(e.target.value)} rows={8}
          placeholder="Transcripcion (automatica o manual)..."
          className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#00C8A0] outline-none resize-none mb-4 placeholder:text-[#646878]" />
        <button onClick={analyze} disabled={loading || transcript.trim().length < 20}
          className="tryvor-btn flex items-center gap-2 px-6 py-2.5 disabled:opacity-40">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
          {loading ? "Analizando con IA..." : "Analizar reunion"}
        </button>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
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
          {result.tasks?.length > 0 && (
            <div className="tryvor-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-[#E05040]" />
                  <h3 className="font-semibold text-white">Tareas</h3>
                  <span className="bg-[#E05040]/20 text-[#E05040] text-xs px-2 py-0.5 rounded-full">{result.tasks.length}</span>
                </div>
                <button onClick={copyTasks} className="flex items-center gap-1.5 text-xs text-[#646878] hover:text-white">
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#00C8A0]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <div className="space-y-2">
                {result.tasks.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#1E2035] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#E05040]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#E05040]">{(t.person || "?").slice(0,2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{t.person}</div>
                      <div className="text-sm text-[#B4B8C6] mt-0.5">{t.task}</div>
                      {t.deadline && <div className="text-xs text-[#646878] mt-1">{t.deadline}</div>}
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
