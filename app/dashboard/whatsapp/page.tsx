// @ts-nocheck
"use client";
import { useState } from "react";
import { MessageSquare, Send, Bot, User, Settings, Loader2 } from "lucide-react";

type Message = { role: "user" | "bot"; text: string; time: string };

const PRESETS = [
  "Hola, quiero reservar mesa para mañana para 2 personas",
  "¿A qué hora abrís?",
  "¿Cuánto cuesta el menú del día?",
  "Quiero cancelar mi cita del jueves",
  "¿Tenéis parking?",
];

export default function WhatsAppPage() {
  const [businessName, setBusinessName] = useState("Restaurante La Brisa");
  const [businessInfo, setBusinessInfo] = useState("Restaurante de cocina canaria en Lanzarote. Horario: L-D 13:00-16:00 y 20:00-23:00. Menú del día: 12€. Reservas hasta 8 personas. Tel: +34 928 000 000.");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! 👋 Soy el asistente virtual de " + businessName + ". ¿En qué puedo ayudarte?", time: "09:00" }
  ]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"chat" | "config">("chat");

  async function send(text?: string) {
    const userText = text || msg;
    if (!userText.trim()) return;
    const now = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { role: "user", text: userText, time: now }]);
    setMsg(""); setLoading(true);
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, businessName, businessInfo, history: messages }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "bot", text: data.reply, time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-[#00C8A0]" />
          <span className="text-xs text-[#00C8A0] font-semibold uppercase tracking-wider">Módulo 01</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Bot WhatsApp 24h</h1>
        <p className="text-[#646878] mt-1">Prueba el bot en tiempo real. Simula mensajes de clientes.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0F1120] rounded-lg p-1 mb-6 w-fit">
        {(["chat", "config"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-[#1E2035] text-white" : "text-[#646878] hover:text-white"}`}>
            {t === "chat" ? "Simulador chat" : "Configuración"}
          </button>
        ))}
      </div>

      {tab === "config" ? (
        <div className="tryvor-card max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="w-4 h-4 text-[#00C8A0]" />
            <h3 className="font-semibold text-white">Configurar negocio</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Nombre del negocio</label>
              <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
            </div>
            <div>
              <label className="text-xs text-[#646878] mb-1.5 block">Base de conocimiento (FAQs, horarios, precios...)</label>
              <textarea value={businessInfo} onChange={e => setBusinessInfo(e.target.value)} rows={6}
                className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none resize-none" />
            </div>
            <button onClick={() => setTab("chat")} className="tryvor-btn w-full">Guardar y probar</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2 tryvor-card flex flex-col" style={{ height: "560px" }}>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#1E2035] mb-4">
              <div className="w-10 h-10 rounded-full bg-[#003D30] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#00C8A0]" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">{businessName}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#00C8A0]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00C8A0] animate-pulse" />
                  Bot activo 24h
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "bot" ? "bg-[#003D30]" : "bg-[#1E2035]"}`}>
                    {m.role === "bot" ? <Bot className="w-3.5 h-3.5 text-[#00C8A0]" /> : <User className="w-3.5 h-3.5 text-[#646878]" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "bot" ? "bg-[#1E2035] text-white rounded-bl-sm" : "bg-[#003D30] text-[#00C8A0] rounded-br-sm"}`}>
                    {m.text}
                    <div className="text-[10px] opacity-50 mt-1">{m.time}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#003D30] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-[#00C8A0]" />
                  </div>
                  <div className="bg-[#1E2035] rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 text-[#00C8A0] animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Escribe un mensaje como cliente..."
                className="flex-1 bg-[#1E2035] border border-[#2E3045] text-white rounded-xl px-4 py-2.5 text-sm focus:border-[#00C8A0] outline-none placeholder:text-[#646878]" />
              <button onClick={() => send()} disabled={loading || !msg.trim()}
                className="tryvor-btn px-4 disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="tryvor-card">
            <h3 className="font-semibold text-white mb-4 text-sm">Mensajes de prueba</h3>
            <div className="space-y-2">
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => send(p)}
                  className="w-full text-left text-xs text-[#B4B8C6] bg-[#1E2035] hover:bg-[#2E3045] hover:text-white rounded-lg px-3 py-2.5 transition-colors border border-transparent hover:border-[#00C8A0]/30">
                  "{p}"
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#1E2035]">
              <p className="text-xs text-[#646878] mb-3">Estado del bot</p>
              <div className="space-y-2">
                {[["Webhook 360Dialog", "pendiente"], ["Google Calendar", "pendiente"], ["Base de conocimiento", "activa"]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs text-[#646878]">{k}</span>
                    <span className={`text-xs font-semibold ${v === "activa" ? "text-[#00C8A0]" : "text-[#D4A020]"}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
