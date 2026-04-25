// @ts-nocheck
"use client";
import { useState } from "react";
import { Mail, Loader2, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";

const SAMPLE_EMAILS = [
  { from: "cliente@restaurante.es", subject: "Consulta presupuesto bot WhatsApp", body: "Hola, vi vuestra web y me interesa el bot de WhatsApp para mi restaurante. ¿Cuánto cuesta y cuándo lo podríais tener listo? Somos un negocio de 3 mesas en Lanzarote.", priority: "alta" },
  { from: "proveedor@360dialog.com", subject: "Your WhatsApp API is ready", body: "Your 360Dialog account has been approved. API key attached. You can now start sending messages.", priority: "media" },
  { from: "banco@caixabank.es", subject: "Extracto mensual disponible", body: "Tu extracto de mayo está disponible en la app. Saldo: 3.240€", priority: "baja" },
  { from: "ana@tryvor.com", subject: "Logo listo para la landing", body: "Javier, te paso el logo en SVG y PNG. Avísame si necesitas algún ajuste de color.", priority: "alta" },
  { from: "newsletter@producthunt.com", subject: "Top products this week", body: "Discover the best new products launched this week on Product Hunt.", priority: "baja" },
];

type EmailWithDraft = typeof SAMPLE_EMAILS[0] & { draft?: string };

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailWithDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [tone, setTone] = useState("profesional y cercano");
  const [name, setName] = useState("Javier");

  async function generateDigest() {
    setLoading(true); setEmails([]);
    const draft = async (email: typeof SAMPLE_EMAILS[0]) => {
      if (email.priority === "baja") return undefined;
      const res = await fetch("/api/email-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tone, name }),
      });
      const d = await res.json();
      return d.draft;
    };
    const withDrafts = await Promise.all(SAMPLE_EMAILS.map(async e => ({ ...e, draft: await draft(e) })));
    setEmails(withDrafts);
    setLoading(false);
  }

  const pColor = (p: string) => p === "alta" ? "#E05040" : p === "media" ? "#D4A020" : "#646878";
  const pIcon = (p: string) => p === "alta" ? AlertCircle : p === "media" ? Clock : Info;

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-[#7060D8]" />
          <span className="text-xs text-[#7060D8] font-semibold uppercase tracking-wider">Módulo 04</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Agente de Email</h1>
        <p className="text-[#646878] mt-1">Cada mañana clasifica tu bandeja y prepara borradores listos para aprobar.</p>
      </div>

      <div className="tryvor-card mb-6">
        <h3 className="font-semibold text-white mb-4">Configuración del agente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#646878] mb-1.5 block">Tu nombre</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#7060D8] outline-none" />
          </div>
          <div>
            <label className="text-xs text-[#646878] mb-1.5 block">Tono de respuesta</label>
            <select value={tone} onChange={e => setTone(e.target.value)}
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#7060D8] outline-none">
              {["profesional y cercano", "formal", "informal y amistoso", "directo al grano", "comercial y persuasivo"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generateDigest} disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7060D8] text-white font-semibold rounded-lg hover:bg-[#5A4DC0] disabled:opacity-50 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {loading ? "Procesando bandeja..." : "Generar digest de mañana"}
        </button>
      </div>

      {emails.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email list */}
          <div className="tryvor-card">
            <h3 className="font-semibold text-white mb-4 text-sm">
              {emails.length} emails procesados · {emails.filter(e => e.priority === "alta").length} urgentes
            </h3>
            <div className="space-y-2">
              {emails.map((e, i) => {
                const Icon = pIcon(e.priority);
                return (
                  <button key={i} onClick={() => setSelected(i)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selected === i ? "bg-[#1E2035] border-[#7060D8]/50" : "bg-[#0F1120] border-[#1E2035] hover:border-[#2E3045]"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: pColor(e.priority) }} />
                      <span className="text-xs font-semibold text-white truncate">{e.subject}</span>
                      {e.draft && <CheckCircle className="w-3 h-3 text-[#00C8A0] ml-auto flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-[#646878] truncate ml-5">{e.from}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Draft preview */}
          {selected !== null && (
            <div className="tryvor-card">
              <div className="mb-4 pb-4 border-b border-[#1E2035]">
                <div className="text-xs text-[#646878] mb-1">De: {emails[selected].from}</div>
                <div className="font-semibold text-white text-sm mb-2">{emails[selected].subject}</div>
                <p className="text-xs text-[#B4B8C6] leading-relaxed">{emails[selected].body}</p>
              </div>
              {emails[selected].draft ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-[#00C8A0]" />
                    <span className="text-sm font-semibold text-[#00C8A0]">Borrador listo</span>
                  </div>
                  <div className="bg-[#1E2035] rounded-lg p-4 text-sm text-[#B4B8C6] leading-relaxed whitespace-pre-wrap mb-4">
                    {emails[selected].draft}
                  </div>
                  <div className="flex gap-2">
                    <a href={`mailto:${emails[selected].from}?subject=Re: ${emails[selected].subject}&body=${encodeURIComponent(emails[selected].draft || "")}`}
                       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#7060D8] text-white font-semibold text-sm rounded-lg hover:bg-[#5A4DC0] transition-colors">
                      <Mail className="w-4 h-4" /> Aprobar y enviar
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(emails[selected].draft || "")}
                      className="px-4 py-2.5 border border-[#2E3045] text-[#646878] text-sm rounded-lg hover:border-[#7060D8] hover:text-white transition-colors">
                      Copiar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-[#646878] text-sm">
                  Email de prioridad baja — no requiere respuesta
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && emails.length === 0 && (
        <div className="tryvor-card text-center py-16">
          <Mail className="w-12 h-12 text-[#1E2035] mx-auto mb-4" />
          <p className="text-[#646878]">Pulsa el botón para procesar tu bandeja de entrada</p>
          <p className="text-xs text-[#646878] mt-2">Claude priorizará y redactará borradores de respuesta</p>
        </div>
      )}
    </div>
  );
}
