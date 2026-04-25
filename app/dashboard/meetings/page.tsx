// @ts-nocheck
"use client";
import { useState } from "react";
import { Video, Mic, Upload, Loader2, CheckCircle, Users, ClipboardList, Mail } from "lucide-react";

type Task = { person: string; task: string; deadline: string };
type MeetingResult = { summary: string; attendees: string[]; decisions: string[]; tasks: Task[] };

export default function MeetingsPage() {
  const [tab, setTab] = useState<"online" | "presencial">("online");
  const [transcript, setTranscript] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [sent, setSent] = useState(false);
  const [emails, setEmails] = useState<Record<string, string>>({});

  const DEMO_TRANSCRIPT = `Javier: Buenos días a todos. Hoy vamos a revisar el avance del proyecto AI Suite.
María: Yo he terminado el diseño de la landing. Pendiente de aprobación.
Carlos: He revisado los costes del stack. Propongo arrancar con Vercel Pro y Supabase Pro esta semana.
Javier: Aprobado. Carlos, ¿puedes gestionar los pagos esta semana?
Carlos: Sí, lo hago el jueves.
María: Yo necesito el logo final para poder publicar la landing. ¿Ana lo puede tener para el miércoles?
Ana: Sin problema, el logo lo entrego el miércoles a mediodía.
Javier: Perfecto. Quedamos para la próxima reunión el próximo lunes a las 10.
María: ¿Alguien se encarga de comunicar a los clientes el lanzamiento?
Javier: Yo me encargo de preparar el email de lanzamiento para finales de semana.`;

  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true); setResult(null); setSent(false);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingTitle }),
      });
      const data = await res.json();
      setResult(data);
      const emailMap: Record<string, string> = {};
      data.attendees?.forEach((a: string) => { emailMap[a] = ""; });
      setEmails(emailMap);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-4 h-4 text-[#E05040]" />
          <span className="text-xs text-[#E05040] font-semibold uppercase tracking-wider">Módulo 05</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Reuniones Inteligentes</h1>
        <p className="text-[#646878] mt-1">Transcribe, resume y envía tareas automáticamente a cada asistente.</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 bg-[#0F1120] rounded-lg p-1 mb-6 w-fit">
        {(["online", "presencial"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-[#1E2035] text-white" : "text-[#646878] hover:text-white"}`}>
            {t === "online" ? "🖥️ Online (Zoom/Meet)" : "🏢 Presencial"}
          </button>
        ))}
      </div>

      {tab === "presencial" && (
        <div className="tryvor-card mb-6 border-[#E05040]/30">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#E05040]" />
            Opciones de grabación presencial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📱", title: "PWA Móvil", desc: "Abre en el navegador del móvil. Pulsa grabar. Sin instalar nada.", badge: "Recomendado" },
              { icon: "💻", title: "Whisper local", desc: "Script Python en Mac/PC con el micrófono del portátil. Graba en sala.", badge: null },
              { icon: "🔴", title: "Raspberry Pi", desc: "Dispositivo dedicado con micrófono omnidireccional en la sala. Permanente.", badge: "Profesional" },
            ].map(({ icon, title, desc, badge }) => (
              <div key={title} className="bg-[#1E2035] rounded-lg p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{title}</span>
                  {badge && <span className="text-[10px] bg-[#E05040]/20 text-[#E05040] px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
                </div>
                <p className="text-xs text-[#646878] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="tryvor-card">
          <h3 className="font-semibold text-white mb-4">Transcripción de la reunión</h3>
          <div className="mb-3">
            <label className="text-xs text-[#646878] mb-1.5 block">Título de la reunión</label>
            <input value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)}
              placeholder="Reunión de equipo — AI Suite"
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#E05040] outline-none placeholder:text-[#646878]" />
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#646878]">Transcripción</label>
              <button onClick={() => setTranscript(DEMO_TRANSCRIPT)}
                className="text-xs text-[#E05040] hover:underline">Cargar demo</button>
            </div>
            <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
              rows={12} placeholder="Pega aquí la transcripción de la reunión..."
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#E05040] outline-none placeholder:text-[#646878] resize-none font-mono text-xs" />
          </div>
          <button onClick={analyze} disabled={loading || !transcript.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-lg bg-[#E05040] text-white hover:bg-[#C04030] disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            {loading ? "Analizando con IA..." : "Analizar reunión"}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Summary */}
              <div className="tryvor-card">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-[#00C8A0]" />
                  <h3 className="font-semibold text-white text-sm">Resumen ejecutivo</h3>
                </div>
                <p className="text-sm text-[#B4B8C6] leading-relaxed">{result.summary}</p>
              </div>

              {/* Attendees */}
              <div className="tryvor-card">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[#2A5FD4]" />
                  <h3 className="font-semibold text-white text-sm">Asistentes detectados</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.attendees?.map(a => (
                    <span key={a} className="bg-[#1E2035] text-[#B4B8C6] text-xs px-3 py-1 rounded-full">{a}</span>
                  ))}
                </div>
              </div>

              {/* Decisions */}
              {result.decisions?.length > 0 && (
                <div className="tryvor-card">
                  <h3 className="font-semibold text-white text-sm mb-3">Decisiones tomadas</h3>
                  <ul className="space-y-1">
                    {result.decisions.map((d, i) => (
                      <li key={i} className="text-xs text-[#B4B8C6] flex gap-2">
                        <span className="text-[#00C8A0] flex-shrink-0">✓</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              <div className="tryvor-card">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-[#D4A020]" />
                  <h3 className="font-semibold text-white text-sm">Tareas por persona</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {result.tasks?.map((t, i) => (
                    <div key={i} className="bg-[#1E2035] rounded-lg p-3 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E05040]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-[#E05040] font-bold">{t.person?.[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{t.person}</div>
                        <div className="text-xs text-[#B4B8C6]">{t.task}</div>
                        {t.deadline && <div className="text-[10px] text-[#D4A020] mt-0.5">⏰ {t.deadline}</div>}
                      </div>
                      <div>
                        <input
                          placeholder={`email@${t.person?.toLowerCase()}.com`}
                          value={emails[t.person] || ""}
                          onChange={e => setEmails(em => ({ ...em, [t.person]: e.target.value }))}
                          className="bg-[#0A0C16] border border-[#2E3045] text-white rounded px-2 py-1 text-[10px] w-36 focus:border-[#E05040] outline-none placeholder:text-[#646878]" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSent(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 font-semibold text-sm rounded-lg bg-[#003D30] text-[#00C8A0] hover:bg-[#005040] transition-colors border border-[#00C8A0]/30">
                  <Mail className="w-4 h-4" />
                  {sent ? "✓ Emails enviados" : "Enviar tareas por email"}
                </button>
              </div>
            </>
          ) : (
            <div className="tryvor-card flex flex-col items-center justify-center h-80 text-center">
              <Video className="w-12 h-12 text-[#1E2035] mb-4" />
              <p className="text-[#646878] text-sm">Carga una transcripción y analiza</p>
              <p className="text-xs text-[#646878] mt-1">Claude extrae resumen, asistentes, decisiones y tareas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
