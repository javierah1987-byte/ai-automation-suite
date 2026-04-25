// @ts-nocheck
import Link from "next/link";

const MODULES = [
  { num: "01", title: "Bot WhatsApp 24h", desc: "Responde, agenda citas y escala al humano sin intervención. 365 días sin parar.", price: "800–1.500€ + 150€/mes", color: "#00C8A0" },
  { num: "02", title: "Excel → CRM", desc: "Limpia, mapea e importa tu base de contactos en 24–48h. Sin perder un solo dato.", price: "400–900€/migración", color: "#2A5FD4" },
  { num: "03", title: "Propuestas PDF", desc: "Del formulario al PDF con tu marca en menos de 30 segundos. Listo para firmar.", price: "600–1.200€ o 79€/mes", color: "#D4A020" },
  { num: "04", title: "Agente email", desc: "Cada mañana clasifica tu bandeja, redacta borradores y te los manda priorizados.", price: "500–1.000€/mes", color: "#7060D8" },
  { num: "05", title: "Reuniones IA", desc: "Graba online y presencial, transcribe con IA y manda las tareas a cada asistente.", price: "800–2.000€ + 100€/mes", color: "#E05040" },
  { num: "06", title: "Scraper de leads", desc: "Encuentra empresas por sector y zona. Claude filtra y puntúa cada lead del 0 al 10.", price: "300–700€ o 200€/mes", color: "#009E78" },
];

const STATS = [
  { val: "6", lbl: "Módulos IA" },
  { val: "< 30 días", lbl: "Primer ingreso" },
  { val: "> 70%", lbl: "Margen bruto" },
  { val: "3.000€+", lbl: "MRR objetivo mes 3" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0C16] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0C16]/90 backdrop-blur border-b border-[#1E2035]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg">
            <span className="text-[#00C8A0]">AI</span> Suite
            <span className="text-[#646878] text-xs ml-2">by Tryvor</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#B4B8C6]">
            <a href="#modulos" className="hover:text-white transition-colors">Módulos</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#campanas" className="hover:text-white transition-colors">Casos de uso</a>
            <a href="mailto:info@tryvor.com" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <Link href="/dashboard" className="tryvor-btn text-sm">
            Acceder →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="dot-grid pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#003D30] text-[#00C8A0] text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-[#00C8A0]/30">
            <span className="w-2 h-2 bg-[#00C8A0] rounded-full animate-pulse"></span>
            Business AI & Growth Partner · Gran Canaria
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Automatiza tu negocio<br />
            <span className="text-[#00C8A0]">con inteligencia artificial</span>
          </h1>
          <p className="text-xl text-[#B4B8C6] mb-10 max-w-2xl mx-auto">
            6 módulos IA para PYMES y agencias españolas. Bot WhatsApp 24h, propuestas PDF,
            reuniones inteligentes, scraper de leads y más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="tryvor-btn text-base px-8 py-3">
              Ver demo gratuita →
            </Link>
            <a href="https://wa.me/34645081015" className="tryvor-btn-outline text-base px-8 py-3">
              Hablar con ventas
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#1E2035] bg-[#0F1120]">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="text-2xl font-bold text-[#00C8A0]">{s.val}</div>
              <div className="text-sm text-[#646878] mt-1">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Los 6 módulos de automatización</h2>
            <p className="text-[#B4B8C6] max-w-xl mx-auto">
              Cada módulo es independiente. Se puede contratar por separado o en bundle.
              Todos comparten el mismo stack y se activan en días, no meses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => (
              <div key={m.num} className="tryvor-card hover:border-[#00C8A0]/40 transition-colors group">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold px-2 py-1 rounded-md"
                        style={{ background: m.color + "20", color: m.color }}>
                    {m.num}
                  </span>
                  <span className="font-semibold">{m.title}</span>
                </div>
                <p className="text-sm text-[#B4B8C6] mb-4 leading-relaxed">{m.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#1E2035]">
                  <span className="text-sm font-semibold" style={{ color: m.color }}>{m.price}</span>
                  <Link href="/dashboard" className="text-xs text-[#646878] group-hover:text-[#00C8A0] transition-colors">
                    Ver demo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0F1120] border-t border-[#1E2035]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-[#B4B8C6] mb-8">
            Sin permanencia. Sin código. Sin complicaciones.
            Primera demo gratuita en 15 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@tryvor.com" className="tryvor-btn text-base px-8 py-3">
              Solicitar demo →
            </a>
            <a href="tel:+34928079604" className="tryvor-btn-outline text-base px-8 py-3">
              +34 928 07 96 04
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E2035] bg-[#0A0C16] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#646878]">
          <div>
            <span className="text-[#00C8A0] font-bold">Tryvor</span> · Business AI & Growth Partner
          </div>
          <div className="flex gap-6">
            <a href="mailto:info@tryvor.com" className="hover:text-white transition-colors">info@tryvor.com</a>
            <a href="tel:+34928079604" className="hover:text-white transition-colors">+34 928 07 96 04</a>
            <a href="https://tryvor.com" className="hover:text-white transition-colors">tryvor.com</a>
          </div>
          <div>Parque Empresarial Melenara · Telde, Las Palmas</div>
        </div>
      </footer>
    </div>
  );
}
