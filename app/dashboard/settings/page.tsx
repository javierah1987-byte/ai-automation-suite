// @ts-nocheck
"use client";
import { useState } from "react";
import { Settings, Key, Building2, CheckCircle, ExternalLink } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "Anthropic Claude API",
    desc: "Motor de IA para todos los módulos",
    key: "ANTHROPIC_API_KEY",
    url: "https://console.anthropic.com",
    required: true,
    color: "#00C8A0",
  },
  {
    name: "Supabase",
    desc: "Base de datos, auth y almacenamiento",
    key: "NEXT_PUBLIC_SUPABASE_URL",
    url: "https://supabase.com/dashboard",
    required: true,
    color: "#2A5FD4",
  },
  {
    name: "Resend",
    desc: "Envío de emails transaccionales",
    key: "RESEND_API_KEY",
    url: "https://resend.com/api-keys",
    required: false,
    color: "#7060D8",
  },
  {
    name: "360Dialog (WhatsApp)",
    desc: "API oficial de WhatsApp Business",
    key: "DIALOG360_API_KEY",
    url: "https://app.360dialog.com",
    required: false,
    color: "#25D366",
  },
  {
    name: "Recall.ai",
    desc: "Grabación de reuniones online (Zoom/Meet/Teams)",
    key: "RECALL_AI_API_KEY",
    url: "https://www.recall.ai/dashboard",
    required: false,
    color: "#E05040",
  },
  {
    name: "Google Maps API",
    desc: "Datos de negocios para el scraper de leads",
    key: "GOOGLE_MAPS_API_KEY",
    url: "https://console.cloud.google.com",
    required: false,
    color: "#D4A020",
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState({
    name: "Tryvor",
    email: "info@tryvor.com",
    phone: "+34 928 07 96 04",
    whatsapp: "+34 645 08 10 15",
    address: "Parque Empresarial Melenara, Telde, Las Palmas",
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-[#646878]" />
          <span className="text-xs text-[#646878] font-semibold uppercase tracking-wider">Configuración</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Ajustes del sistema</h1>
        <p className="text-[#646878] mt-1">Configura las integraciones y los datos de tu empresa.</p>
      </div>

      {/* Brand info */}
      <div className="tryvor-card mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4 text-[#00C8A0]" />
          <h3 className="font-semibold text-white">Datos de empresa</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(brand).map(([k, v]) => (
            <div key={k}>
              <label className="text-xs text-[#646878] mb-1.5 block capitalize">{k.replace(/([A-Z])/g, " $1")}</label>
              <input value={v} onChange={e => setBrand(b => ({ ...b, [k]: e.target.value }))}
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
            </div>
          ))}
        </div>
        <button onClick={save} className="tryvor-btn mt-4 flex items-center gap-2">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {saved ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>

      {/* API Keys */}
      <div className="tryvor-card">
        <div className="flex items-center gap-2 mb-5">
          <Key className="w-4 h-4 text-[#D4A020]" />
          <h3 className="font-semibold text-white">Integraciones y API Keys</h3>
          <span className="text-xs text-[#646878] ml-auto">Configurar en .env.local o Vercel Dashboard</span>
        </div>
        <div className="space-y-3">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="flex items-center gap-4 bg-[#1E2035] rounded-lg p-4">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: int.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{int.name}</span>
                  {int.required && (
                    <span className="text-[10px] bg-[#E05040]/20 text-[#E05040] px-1.5 py-0.5 rounded font-semibold">REQUERIDA</span>
                  )}
                </div>
                <div className="text-xs text-[#646878] mt-0.5">{int.desc}</div>
                <div className="text-[10px] text-[#646878] mt-0.5 font-mono">{int.key}</div>
              </div>
              <a href={int.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#646878] hover:text-white transition-colors flex-shrink-0">
                Obtener key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        {/* Cost summary */}
        <div className="mt-6 pt-5 border-t border-[#1E2035]">
          <h4 className="text-sm font-semibold text-white mb-3">Coste del stack estimado</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { lbl: "Stack base", val: "~200€/mes", sub: "Vercel + Supabase + Resend" },
              { lbl: "Claude API", val: "100–400€/mes", sub: "Escala con uso de clientes" },
              { lbl: "WhatsApp + Recall", val: "~100€/mes", sub: "Por módulo activo" },
              { lbl: "TOTAL", val: "650–900€/mes", sub: "Margen neto > 70%" },
            ].map(({ lbl, val, sub }) => (
              <div key={lbl} className="bg-[#12141F] rounded-lg p-3">
                <div className="text-xs text-[#646878] mb-1">{lbl}</div>
                <div className="text-sm font-bold text-[#00C8A0]">{val}</div>
                <div className="text-[10px] text-[#646878]">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
