// @ts-nocheck
"use client";
import { useState } from "react";
import { Search, Download, Star, Globe, Phone, MapPin, Loader2 } from "lucide-react";

const SECTORS = ["Restaurantes", "Clínicas dentales", "Fisioterapia", "Hoteles", "Inmobiliarias", "Asesorías", "Academias", "Talleres mecánicos", "Peluquerías", "Gimnasios"];
const ZONES = ["Lanzarote", "Gran Canaria", "Tenerife", "Fuerteventura", "Madrid", "Barcelona", "Sevilla", "Valencia", "Málaga"];

type Lead = {
  name: string; address: string; phone: string; website: string;
  rating: number; reviews: number; score: number; sector: string;
};

export default function ScraperPage() {
  const [sector, setSector] = useState("Restaurantes");
  const [zone, setZone] = useState("Lanzarote");
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  async function runScraper() {
    setLoading(true); setError(""); setLeads([]);
    try {
      const res = await fetch("/api/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, zone, limit }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(data.leads || []);
    } catch (e: any) {
      setError(e.message || "Error al ejecutar el scraper");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const headers = ["Nombre", "Dirección", "Teléfono", "Web", "Valoración", "Reseñas", "Score IA"];
    const rows = leads.map(l => [l.name, l.address, l.phone, l.website, l.rating, l.reviews, l.score]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `leads_${sector}_${zone}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  const scoreColor = (s: number) => s >= 8 ? "#00C8A0" : s >= 6 ? "#D4A020" : "#E05040";

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-[#00C8A0]" />
          <span className="text-xs text-[#00C8A0] font-semibold uppercase tracking-wider">Módulo 06</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Scraper de Leads</h1>
        <p className="text-[#646878] mt-1">Encuentra empresas por sector y zona. Claude puntúa cada lead del 0 al 10.</p>
      </div>

      {/* Config */}
      <div className="tryvor-card mb-6">
        <h3 className="font-semibold text-white mb-4">Configurar búsqueda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#646878] mb-2 block">Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)}
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none">
              {SECTORS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#646878] mb-2 block">Zona geográfica</label>
            <select value={zone} onChange={e => setZone(e.target.value)}
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none">
              {ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#646878] mb-2 block">Nº de leads (máx. 200)</label>
            <input type="number" value={limit} min={10} max={200} onChange={e => setLimit(+e.target.value)}
              className="w-full bg-[#1E2035] border border-[#2E3045] text-white rounded-lg px-3 py-2 text-sm focus:border-[#00C8A0] outline-none" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={runScraper} disabled={loading}
            className="tryvor-btn flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Buscando..." : "Iniciar búsqueda"}
          </button>
          {leads.length > 0 && (
            <button onClick={exportCSV} className="tryvor-btn-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV ({leads.length})
            </button>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results */}
      {leads.length > 0 && (
        <div className="tryvor-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{leads.length} leads encontrados</h3>
            <span className="text-xs text-[#646878]">{sector} en {zone}</span>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {leads.map((lead, i) => (
              <div key={i} className="flex items-center gap-4 bg-[#0F1120] rounded-lg p-3 hover:border-[#1E2035] border border-transparent hover:border-[#2E3045] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1E2035] flex items-center justify-center text-xs text-[#646878] flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">{lead.name}</div>
                  <div className="flex items-center gap-3 mt-1">
                    {lead.address && <span className="flex items-center gap-1 text-xs text-[#646878]"><MapPin className="w-3 h-3" />{lead.address.slice(0, 30)}</span>}
                    {lead.phone && <span className="flex items-center gap-1 text-xs text-[#646878]"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    {lead.website && <span className="flex items-center gap-1 text-xs text-[#646878]"><Globe className="w-3 h-3" />web</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-[#646878]">
                    <Star className="w-3 h-3 text-[#D4A020]" />
                    {lead.rating} ({lead.reviews})
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                       style={{ borderColor: scoreColor(lead.score), color: scoreColor(lead.score) }}>
                    {lead.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && leads.length === 0 && (
        <div className="tryvor-card text-center py-16">
          <Search className="w-12 h-12 text-[#1E2035] mx-auto mb-4" />
          <p className="text-[#646878]">Configura la búsqueda y pulsa "Iniciar búsqueda"</p>
          <p className="text-xs text-[#646878] mt-2">Claude puntuará cada lead del 0–10 según calidad</p>
        </div>
      )}
    </div>
  );
}
