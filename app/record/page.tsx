// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2, StopCircle } from "lucide-react";

export default function RecordPage() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(1000);
      mediaRef.current = mr;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch {
      setError("No se pudo acceder al micrófono. Verifica los permisos del navegador.");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function sendForAnalysis() {
    if (!audioBlob) return;
    setUploading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "meeting.webm");
      formData.append("title", meetingTitle || "Reunión presencial");
      const res = await fetch("/api/meetings/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Error al procesar el audio");
    } finally {
      setUploading(false);
    }
  }

  function copyBrief() {
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
    if (r.transcript) L.push(`\n---\n## Transcripción completa\n${r.transcript}`);
    navigator.clipboard.writeText(L.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0A0C16] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white mb-1">
            <span className="text-[#00C8A0]">AI</span> Suite
          </div>
          <div className="text-sm text-[#646878]">Grabador de reuniones presenciales</div>
        </div>

        {/* Meeting title */}
        <div className="mb-6">
          <input
            value={meetingTitle}
            onChange={e => setMeetingTitle(e.target.value)}
            placeholder="Nombre de la reunión (opcional)"
            className="w-full bg-[#12141F] border border-[#1E2035] text-white rounded-xl px-4 py-3 text-sm focus:border-[#00C8A0] outline-none placeholder:text-[#646878] text-center"
          />
        </div>

        {/* Big record button */}
        <div className="flex flex-col items-center mb-8">
          {!done ? (
            <>
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg mb-4 ${
                  recording
                    ? "bg-[#E05040] animate-pulse shadow-[#E05040]/30 shadow-2xl"
                    : "bg-[#00C8A0] hover:bg-[#009E78] shadow-[#00C8A0]/20 shadow-xl"
                }`}
              >
                {recording
                  ? <StopCircle className="w-12 h-12 text-white" />
                  : <Mic className="w-12 h-12 text-[#0A0C16]" />}
              </button>
              <div className="text-2xl font-mono text-white mb-1">{fmt(seconds)}</div>
              <div className="text-sm text-[#646878]">
                {recording ? "Grabando... pulsa para detener" : audioBlob ? "Grabación lista" : "Pulsa para grabar"}
              </div>
            </>
          ) : (
            <div className="w-full text-left">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">✅</div>
                <div className="text-lg font-semibold text-[#00C8A0]">Reunión procesada</div>
              </div>
              {result?.summary && (
                <div className="bg-[#12141F] rounded-xl p-4 mb-3">
                  <div className="text-xs text-[#646878] font-semibold uppercase tracking-wide mb-2">Resumen</div>
                  <p className="text-sm text-[#B4B8C6] leading-relaxed">{result.summary}</p>
                </div>
              )}
              {result?.objetivo && (
                <div className="bg-[#12141F] rounded-xl p-4 mb-3">
                  <div className="text-xs text-[#646878] font-semibold uppercase tracking-wide mb-2">Objetivo</div>
                  <p className="text-sm text-[#B4B8C6] leading-relaxed">{result.objetivo}</p>
                </div>
              )}
              {result?.funcionalidades?.length > 0 && (
                <div className="bg-[#12141F] rounded-xl p-4 mb-3">
                  <div className="text-xs text-[#646878] font-semibold uppercase tracking-wide mb-2">Funcionalidades ({result.funcionalidades.length})</div>
                  <ul className="text-sm text-[#B4B8C6] space-y-1">
                    {result.funcionalidades.map((f, i) => (
                      <li key={i}>• <span className="text-[#00C8A0]">[{f.prioridad || "?"}]</span> {f.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result?.tasks?.length > 0 && (
                <div className="bg-[#12141F] rounded-xl p-4 mb-3">
                  <div className="text-xs text-[#646878] font-semibold uppercase tracking-wide mb-2">Tareas ({result.tasks.length})</div>
                  <ul className="text-sm text-[#B4B8C6] space-y-1">
                    {result.tasks.map((t, i) => (
                      <li key={i}>• {t.person}: {t.task}{t.deadline ? ` (${t.deadline})` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button onClick={copyBrief} className="w-full tryvor-btn flex items-center justify-center gap-2 py-3 text-sm mb-2">
                {copied ? "✓ Brief copiado" : "📋 Copiar brief completo"}
              </button>
              <button onClick={() => { setDone(false); setResult(null); setAudioBlob(null); setSeconds(0); }} className="w-full text-[#646878] text-sm py-2">
                Grabar otra reunión
              </button>
            </div>
          )}
        </div>

        {/* Waveform visual when recording */}
        {recording && (
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-[#00C8A0] rounded-full"
                style={{
                  height: `${8 + Math.random() * 24}px`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animation: "pulse 0.5s ease-in-out infinite alternate",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Send button */}
        {audioBlob && !recording && !done && (
          <button
            onClick={sendForAnalysis}
            disabled={uploading}
            className="w-full tryvor-btn flex items-center justify-center gap-2 py-4 text-base"
          >
            {uploading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Transcribiendo con IA...</>
              : <><Send className="w-5 h-5" /> Enviar para analizar</>}
          </button>
        )}

        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

        {/* Instructions */}
        {!recording && !audioBlob && !done && (
          <div className="mt-8 bg-[#12141F] rounded-xl p-4 space-y-2">
            <p className="text-xs text-[#646878] font-semibold uppercase tracking-wide mb-3">Cómo funciona</p>
            {[
              ["1", "Pulsa el botón verde para empezar a grabar"],
              ["2", "Deja el móvil en el centro de la mesa"],
              ["3", "Al terminar, pulsa el botón rojo para parar"],
              ["4", "Envía la grabación — Claude transcribe y extrae tareas"],
            ].map(([num, text]) => (
              <div key={num} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[#1E2035] text-[#00C8A0] text-xs flex items-center justify-center font-bold flex-shrink-0">{num}</span>
                <span className="text-xs text-[#646878]">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
