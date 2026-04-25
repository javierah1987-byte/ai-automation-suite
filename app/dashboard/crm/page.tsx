// @ts-nocheck
"use client";
import { useState } from "react";
import { Database, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const DEMO_CSV = `Nombre,Apellido,Tlf.,Empresa cliente,e-mail,Ciudad,Notas
Pedro,García,+34 600 123 456,Restaurante La Brisa,pedro@labrisa.es,Lanzarote,Cliente VIP
María,López,,Clínica Dental Blanco,maria@dental.es,Las Palmas,Interesada en bot WhatsApp
Carlos,Ruiz,928 000 001,Asesoría Fiscal Sur,carlos@fiscal.com,Telde,Reunion pendiente
Ana,Martín,+34 645 222 333,Hotel Miramar,,Fuerteventura,Llamar martes
José,González,600444555,José González Reformas,jose@reformas.es,Arrecife,`;

type Contact = { name: string; phone: string; company: string; email: string; city: string; notes: string };
type Report = { imported: number; skipped: number; fixed: number; contacts: Contact[] };

export default function CRMPage() {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  async function migrate() {
    setLoading(true); setReport(null);
    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      setReport(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-[#2A5FD4]" />
          <span className="text-xs text-[#2A5FD4] font-semibold uppercase tracking-wider">Módulo 02</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Migración Excel → CRM</h1>
        <p className="text-[#646878] mt-1">Limpia, normaliza y migra tu base de contactos. Claude mapea columnas automáticamente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tryvor-card">
          <h3 className="font-semibold text-white mb-4">Importar datos CSV / Excel</h3>
          <div className="mb-4 p-4 bg-[#1E2035] rounded-lg border border-dashed border-[#2E3045] text-center">
            <Upload className="w-8 h-8 text-[#646878] mx-auto mb-2" />
            <p className="text-sm text-[#646878]">Arrastra tu Excel aquí o pega el contenido CSV</p>
            <p className="text-xs text-[#646878] mt-1">Claude detecta y mapea columnas automáticamente</p>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs text-[#646878]">Contenido CSV</label>
            <button onClick={() => setCsvText(DEMO_CSV)} className="text-xs text-[#2A5FD4] hover:underline">Cargar demo</button>
          </div>
          <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={10}
            placeholder="Pega aquí tu CSV o exportación de Excel..."
            className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-xs font-mono focus:border-[#2A5FD4] outline-none placeholder:text-[#646878] resize-none mb-4" />
          <button onClick={migrate} disabled={loading || !csvText.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm rounded-lg bg-[#2A5FD4] text-white hover:bg-[#1E4DB0] disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {loading ? "Migrando con IA..." : "Migrar al CRM"}
          </button>
        </div>

        <div className="space-y-4">
          {report ? (
            <>
              <div className="tryvor-card">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-[#00C8A0]" />
                  <h3 className="font-semibold text-white text-sm">Informe de migración</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { val: report.imported, lbl: "Importados", col: "#00C8A0" },
                    { val: report.fixed, lbl: "Corregidos", col: "#D4A020" },
                    { val: report.skipped, lbl: "Omitidos", col: "#E05040" },
                  ].map(({ val, lbl, col }) => (
                    <div key={lbl} className="bg-[#1E2035] rounded-lg p-3 text-center">
                      <div className="text-xl font-bold" style={{ color: col }}>{val}</div>
                      <div className="text-xs text-[#646878]">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tryvor-card">
                <h3 className="font-semibold text-white text-sm mb-3">Contactos en el CRM</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {report.contacts?.map((c, i) => (
                    <div key={i} className="bg-[#1E2035] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#2A5FD4]/20 flex items-center justify-center text-xs text-[#2A5FD4] font-bold">
                          {c.name?.[0] || "?"}
                        </div>
                        <span className="font-semibold text-white text-sm">{c.name}</span>
                        {c.company && <span className="text-xs text-[#646878]">· {c.company}</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 ml-8 text-xs text-[#646878]">
                        {c.phone && <span>📞 {c.phone}</span>}
                        {c.email && <span>✉️ {c.email}</span>}
                        {c.city && <span>📍 {c.city}</span>}
                      </div>
                      {c.notes && <div className="ml-8 mt-1 text-xs text-[#646878] italic">{c.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="tryvor-card flex flex-col items-center justify-center h-80 text-center">
              <Database className="w-12 h-12 text-[#1E2035] mb-4" />
              <p className="text-[#646878] text-sm">Importa tu CSV para ver los contactos</p>
              <p className="text-xs text-[#646878] mt-1">Claude normaliza teléfonos, elimina duplicados y mapea columnas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
