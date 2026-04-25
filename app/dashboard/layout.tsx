// @ts-nocheck
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, FileText, Mail,
  Video, Database, Search, Settings, ChevronRight, Zap, Users
} from "lucide-react";

const NAV_CRM = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
];
const NAV_MODULES = [
  { href: "/dashboard/whatsapp", label: "WhatsApp Bot", icon: MessageSquare, badge: "24h" },
  { href: "/dashboard/proposals", label: "Propuestas PDF", icon: FileText },
  { href: "/dashboard/email", label: "Agente Email", icon: Mail },
  { href: "/dashboard/meetings", label: "Reuniones IA", icon: Video },
  { href: "/dashboard/crm", label: "Excel → CRM", icon: Database },
  { href: "/dashboard/scraper", label: "Scraper Leads", icon: Search },
];

function NavItem({ href, label, icon: Icon, badge, path }) {
  const active = path === href || (href !== "/dashboard" && path.startsWith(href));
  return (
    <Link href={href}
      className={"flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all " +
        (active ? "bg-[#003D30] text-[#00C8A0] border-l-2 border-[#00C8A0]" : "text-[#B4B8C6] hover:bg-[#1E2035] hover:text-white")}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && <span className="text-[10px] font-bold bg-[#00C8A0] text-[#0A0C16] px-1.5 py-0.5 rounded-full">{badge}</span>}
      {active && <ChevronRight className="w-3 h-3 ml-auto" />}
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const path = usePathname();
  return (
    <div className="flex h-screen bg-[#0A0C16] overflow-hidden">
      <aside className="w-60 bg-[#0F1120] border-r border-[#1E2035] flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-[#1E2035]">
          <Zap className="w-5 h-5 text-[#00C8A0] mr-2" />
          <span className="font-bold text-white">AI Suite</span>
          <span className="text-[#646878] text-xs ml-2">by Tryvor</span>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3">
            <p className="text-xs font-semibold text-[#646878] uppercase tracking-wider px-3 mb-2">General</p>
            {NAV_CRM.map(item => <NavItem key={item.href} {...item} path={path} />)}
            <p className="text-xs font-semibold text-[#646878] uppercase tracking-wider px-3 mb-2 mt-5">Módulos IA</p>
            {NAV_MODULES.map(item => <NavItem key={item.href} {...item} path={path} />)}
          </div>
        </nav>
        <div className="p-4 border-t border-[#1E2035]">
          <Link href="/dashboard/settings"
            className={"flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors " +
              (path.includes("settings") ? "text-[#00C8A0] bg-[#003D30]" : "text-[#646878] hover:text-white hover:bg-[#1E2035]")}>
            <Settings className="w-4 h-4" /> Ajustes
          </Link>
          <div className="mt-3 px-3 py-2 bg-[#0A0C16] rounded-lg">
            <div className="text-xs text-[#646878] mb-1">MRR actual</div>
            <div className="text-sm font-bold text-[#00C8A0]">229€/mes</div>
            <div className="w-full bg-[#1E2035] rounded-full h-1 mt-1.5">
              <div className="bg-[#00C8A0] h-1 rounded-full" style={{ width: "7.6%" }} />
            </div>
            <div className="text-[10px] text-[#646878] mt-1">Objetivo: 3.000€/mes</div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#0A0C16]">{children}</main>
    </div>
  );
}
