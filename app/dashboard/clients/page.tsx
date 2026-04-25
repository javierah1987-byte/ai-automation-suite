// @ts-nocheck
"use client";
import { useState } from "react";
import { Users, Plus, Euro, TrendingUp, Phone, Mail, MessageSquare } from "lucide-react";

const DEMO_CLIENTS = [
  { id: "1", name: "Pedro García", company: "Restaurante La Brisa", email: "pedro@labrisa.es", phone: "+34 600 123 456", sector: "Hostelería", module: "whatsapp", status: "active", mrr: 150, notes: "Bot WhatsApp instalado. Muy contento." },
  { id: "2", name: "María López", company: "Clínica Dental Blanco", email: "maria@dental.es", phone: "+34 610 234 567", sector: "Salud", module: "meetings", status: "demo", mrr: 0, notes: "Demo reuniones el jueves 29." },
  { id: "3", name: "Carlos Ruiz", company: "Asesoría Fiscal Sur", email: "carlos@fiscal.com", phone: "+34 928 001 002", sector: "Asesorías", module: "proposals", status: "active", mrr: 79, notes: "Plan SaaS propuestas PDF 79€/mes." },
];

const STATUS_COLORS = {
  lead: { bg: "#1E2035", text: "#646878", label: "Lead" },
  demo: { bg: "#D4A02020", text: "#D4A020", label: "Demo" },
  active: { bg: "#00C8A020", text: "#00C8A0", label: "Activo" },
  churned: { bg: "#E0504020", text: "#E05040", label: "Baja" },
};

const MODULE_ICONS = {
  whatsapp: { icon: MessageSquare, color: "#25D366" },
  proposals: { icon: TrendingUp, color: "#D4A020" },
  email: { icon: Mail, color: "#7060D8" },
  meetings: { icon: Users, color: "#E05040" },
  crm: { icon: Users, color: "#2A5FD4" },
  scraper: { icon: TrendingUp, color: "#00C8A0" },
};

export default function ClientsPage() {
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", sector: "Hostelería", module: "whatsapp", status: "lead", mrr: "0", notes: "" });

  const totalMRR = clients.filter(c => c.status === "active").reduce((s, c) => s + c.mrr, 0);
  const active = clients.filter(c => c.status === "active").length;

  function addClient() {
    setClients(cs => [...cs, { ...form, id: Date.now().toString(), mrr: Number(form.mrr) }]);
    setShowAdd(false);
    setForm({ name: "", company: "", email: "", phone: "", sector: "Hostelería", module: "whatsapp", status: "lead", mrr: "0", notes: "" });
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00C8A0]" />
              <span className="text-xs text-[#00C8A0] font-semibold uppercase tracking-wider">CRM interno</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-[#646878] mt-1">Gestiona todos tus clientes y su módulo contratado.</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="tryvor-btn flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir cliente
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: "Total clientes", val: clients.length, color: "#00C8A0" },
          { icon: TrendingUp, label: "Clientes activos", val: active, color: "#2A5FD4" },
          { icon: Euro, label: "MRR total", val: `${totalMRR}€/mes`, color: "#D4A020" },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="tryvor-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#646878]">{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-2xl font-bold text-white">{val}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="tryvor-card mb-6 border-[#00C8A0]/30">
          <h3 className="font-semibold text-white mb-4">Nuevo cliente</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              ["name", "Nombre *", "Pedro García"],
              ["company", "Empresa *", "Restaurante La Brisa"],
              ["email", "Email", "pedro@labrisa.es"],
              ["phone", "Teléfono", "+34 600 000 000"],
              ["mrr", "MRR (€/mes)", "150"],
              ["notes", "Notas", ""],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="text-xs text-[#646878] mb-1.5 block">{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none placeholder:text-[#646878]" />
              </div>
            ))}
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Módulo</label>
              <select value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none">
                {["whatsapp", "proposals", "email", "meetings", "crm", "scraper"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Estado</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none">
                {["lead", "demo", "active", "churned"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addClient} className="tryvor-btn">Guardar cliente</button>
            <button onClick={() => setShowAdd(false)} className="tryvor-btn-outline">Cancelar</button>
          </div>
        </div>
      )}

      {/* Client list */}
      <div className="space-y-3">
        {clients.map(c => {
          const st = STATUS_COLORS[c.status] || STATUS_COLORS.lead;
          const mod = MODULE_ICONS[c.module] || { icon: Users, color: "#646878" };
          const ModIcon = mod.icon;
          return (
            <div key={c.id} className="tryvor-card hover:border-[#2E3045] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1E2035] flex items-center justify-center flex-shrink-0 font-bold text-[#00C8A0]">
                  {c.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-[#646878] text-sm">{c.company}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#1E2035]" style={{ color: mod.color }}>
                      <ModIcon className="w-3 h-3" />{c.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#646878] flex-wrap">
                    {c.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                    {c.notes && <span className="italic">{c.notes}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {c.mrr > 0 && <div className="text-[#00C8A0] font-bold">{c.mrr}€/mes</div>}
                  <div className="text-xs text-[#646878]">{c.sector}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
