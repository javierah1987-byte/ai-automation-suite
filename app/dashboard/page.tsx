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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard · AI Suite</h1>
        <p className="text-[#646878] mt-1">Bienvenido Javier. Todos los módulos listos.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="tryvor-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#646878] uppercase">{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-[#646878]">{sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(({ href, icon: Icon, title, desc, color }) => (
          <Link key={href} href={href} className="tryvor-card hover:border-[#00C8A0]/30 transition-all group block">
            <div className="flex items-start gap-4">
              <div style={{ background: color+'20' }} className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">{title}</div>
                <p className="text-xs text-[#646878] mt-1">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
