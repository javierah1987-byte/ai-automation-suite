// @ts-nocheck
import Link from "next/link";
import { MessageSquare, FileText, Mail, Video, Database, Search, TrendingUp, Users, Euro, Clock } from "lucide-react";

const MODULES = [
  { href: "/dashboard/whatsapp", icon: MessageSquare, title: "WhatsApp Bot 24h", desc: "Configura el bot y gestiona conversaciones", status: "ready", color: "#00C8A0", clients: 0 },
  { href: "/dashboard/proposals", icon: FileText, title: "Propuestas PDF", desc: "Genera propuestas con tu marca automáticamente", status: "ready", color: "#D4A020", clients: 0 },
  { href: "/dashboard/email", icon: Mail, title: "Agente Email", desc: "Digest diario y borradores automáticos", status: "ready", color: "#7060D8", clients: 0 },
  { href: "/dashboard/meetings", icon: Video, title: "Reuniones IA", desc: "Graba, transcribe y envía tareas automáticamente", status: "ready", color: "#E05040", clients: 0 },
  { href: "/dashboard/crm", icon: Database, title: "Excel → CRM", desc: "Migra y limpia tu base de datos de contactos", status: "ready", color: "#2A5FD4", clients: 0 },
  { href: "/dashboard/scraper", icon: Search, title: "Scraper de Leads", desc: "Encuentra empresas por sector y zona geográfica", status: "ready", color: "#009E78", clients: 0 },
];

const STATS = [
  { icon: TrendingUp, label: "MRR", value: "0€", sub: "Objetivo: 3.000€/mes", color: "#00C8A0" },
  { icon: Users, label: "Clientes activos", value: "0", sub: "Objetivo mes 3: 6–10", color: "#2A5FD4" },
  { icon: Euro, label: "Facturado total", value: "0€", sub: "Primer ingreso < 30 días", color: "#D4A020" },
  { icon: Clock, label: "Días en marcha", value: "1", sub: "Arrancamos hoy", color: "#7060D8" },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[#00C8A0] rounded-full animate-pulse" />
          <span className="text-xs text-[#00C8A0] font-semibold uppercase tracking-wider">Sistema operativo</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Dashboard · AI Automation Suite</h1>
        <p className="text-[#646878] mt-1">Bienvenido Javier. Todos los módulos listos para arrancar.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="tryvor-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#646878] uppercase tracking-wide">{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-[#646878]">{sub}</div>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[#646878] uppercase tracking-wider mb-4">Módulos activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(({ href, icon: Icon, title, desc, color, clients }) => (
            <Link
              key={href}
              href={href}
              className="tryvor-card hover:border-[#00C8A0]/30 transition-all group cursor-pointer block"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ background: color + "20" }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white text-sm">{title}</span>
                    <span className="text-[10px] bg-[#003D30] text-[#00C8A0] px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                      LISTO
                    </span>
                  </div>
                  <p className="text-xs text-[#646878] mt-1 leading-relaxed">{desc}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[#646878]">{clients} clientes</span>
                    <span className="flex-1" />
                    <span className="text-xs text-[#00C8A0] opacity-0 group-hover:opacity-100 transition-opacity">
                      Abrir →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Roadmap quick view */}
      <div className="tryvor-card">
        <h3 className="font-semibold text-white mb-4">Plan de lanzamiento — 90 días</h3>
        <div className="space-y-3">
          {[
            { phase: "Sem 0", label: "Infraestructura", desc: "Stack, repo, env vars, Vercel + Supabase", done: true },
            { phase: "Sem 1–2", label: "Scraper + Propuestas PDF", desc: "Primeras demos y primeros leads", done: false },
            { phase: "Sem 3–4", label: "WhatsApp Bot + Agente Email", desc: "Primer cliente pagando", done: false },
            { phase: "Sem 5–8", label: "CRM + Reuniones IA", desc: "Online y presencial con Raspberry Pi / PWA", done: false },
            { phase: "Mes 2–3", label: "Escala + SaaS", desc: "5–10 clientes, Stripe, MRR 3.000€+", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.done ? "bg-[#00C8A0]" : "bg-[#1E2035] border-2 border-[#2E3045]"}`} />
              <div className="w-16 text-xs text-[#646878] flex-shrink-0">{item.phase}</div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${item.done ? "text-[#00C8A0]" : "text-white"}`}>{item.label}</span>
                <span className="text-xs text-[#646878] ml-2">{item.desc}</span>
              </div>
              {item.done && <span className="text-xs text-[#00C8A0] font-semibold">✓ Hecho</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
