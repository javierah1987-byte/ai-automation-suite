// @ts-nocheck
"use client";
import { useState } from "react";
import { FileText, Send, Loader2, CheckCircle } from "lucide-react";

export default function ProposalsPage() {
  const [form, setForm] = useState({
    clientName: "", clientCompany: "", clientEmail: "",
    sector: "Hostelería", service: "", budget: "", deadline: "",
    notes: "", brandName: "Tryvor"
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function generate() {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const SECTORS = ["Hostelería", "Clínicas y salud", "Asesorías", "Agencias marketing", "Inmobiliarias", "Retail", "Educación", "Construcción", "Otros"];
  const SERVICES = ["Bot WhatsApp 24h", "Propuestas PDF automatizadas", "Agente email matutino", "Reuniones inteligentes", "Migración Excel→CRM", "Scraper de leads", "Suite completa (todos los módulos)"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-[#D4A020]" />
          <span className="text-xs text-[#D4A020] font-semibold uppercase tracking-wider">Módulo 03</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Generador de Propuestas PDF</h1>
        <p className="text-[#646878] mt-1">Del formulario al PDF con marca en menos de 30 segundos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="tryvor-card">
          <h3 className="font-semibold text-white mb-5">Datos de la propuesta</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Nombre cliente *</label>
                <input value={form.clientName} onChange={e => set("clientName", e.target.value)}
                  placeholder="Pedro García"
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878]" />
              </div>
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Empresa *</label>
                <input value={form.clientCompany} onChange={e => set("clientCompany", e.target.value)}
                  placeholder="Restaurante El Mar"
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Email cliente *</label>
              <input type="email" value={form.clientEmail} onChange={e => set("clientEmail", e.target.value)}
                placeholder="pedro@restauranteelmar.es"
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Sector</label>
                <select value={form.sector} onChange={e => set("sector", e.target.value)}
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none">
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Servicio *</label>
                <select value={form.service} onChange={e => set("service", e.target.value)}
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none">
                  <option value="">Seleccionar...</option>
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Presupuesto aprox.</label>
                <input value={form.budget} onChange={e => set("budget", e.target.value)}
                  placeholder="1.000€"
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878]" />
              </div>
              <div>
                <label className="text-xs text-[#646878] mb-1.5 block">Plazo entrega</label>
                <input value={form.deadline} onChange={e => set("deadline", e.target.value)}
                  placeholder="2 semanas"
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Notas adicionales</label>
              <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                rows={3} placeholder="Contexto adicional, necesidades especiales..."
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#D4A020] outline-none placeholder:text-[#646878] resize-none" />
            </div>
            <button onClick={generate} disabled={loading || !form.clientName || !form.service}
              className="tryvor-btn w-full flex items-center justify-center gap-2 disabled:opacity-50 py-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Generando propuesta..." : "Generar propuesta PDF"}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>

        {/* Preview */}
        <div className="tryvor-card">
          <h3 className="font-semibold text-white mb-5">Vista previa</h3>
          {result ? (
            <div>
              <div className="flex items-center gap-3 mb-4 bg-[#003D30] rounded-lg px-4 py-3">
                <CheckCircle className="w-5 h-5 text-[#00C8A0]" />
                <div>
                  <div className="text-sm font-semibold text-[#00C8A0]">Propuesta generada</div>
                  <div className="text-xs text-[#646878]">Lista para enviar a {form.clientEmail}</div>
                </div>
              </div>
              <div className="bg-[#1E2035] rounded-lg p-4 text-sm text-[#B4B8C6] leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {result.proposal}
              </div>
              <div className="mt-4 flex gap-3">
                <a href={`mailto:${form.clientEmail}?subject=Propuesta ${form.service} - Tryvor&body=${encodeURIComponent(result.proposal)}`}
                   className="tryvor-btn text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" /> Enviar por email
                </a>
                <button onClick={() => navigator.clipboard.writeText(result.proposal)}
                  className="tryvor-btn-outline text-sm">Copiar</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-[#1E2035] mb-4" />
              <p className="text-[#646878] text-sm">Rellena el formulario y genera tu propuesta</p>
              <p className="text-xs text-[#646878] mt-1">Claude redactará un texto profesional en segundos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
