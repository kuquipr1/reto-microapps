"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, X, LayoutDashboard, Users, BarChart3, HeadphonesIcon, FolderOpen, FileText } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { language } = useLanguage();
  const pathname = usePathname();

  const links = [
    {
      name: language === "en" ? "Dashboard" : "Panel Principal",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: language === "en" ? "CRM (Customers)" : "CRM (Clientes)",
      href: "/apps/crm",
      icon: Users,
    },
    {
      name: language === "en" ? "Analytics" : "Analíticas",
      href: "/apps/analytics",
      icon: BarChart3,
    },
    {
      name: language === "en" ? "HelpDesk" : "Soporte (HelpDesk)",
      href: "/apps/helpdesk",
      icon: HeadphonesIcon,
    },
    {
      name: language === "en" ? "Documents" : "Documentos",
      href: "/apps/documents",
      icon: FolderOpen,
    },
    {
      name: language === "en" ? "Payroll" : "Nóminas",
      href: "/apps/payroll",
      icon: FileText,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0A0520]/80 backdrop-blur-2xl border-r border-white/10 text-white transition-all duration-300">
      {/* Top Section */}
      <div className="flex items-center justify-between h-16 shrink-0 px-4 border-b border-white/10">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'w-0 opacity-0 lg:w-auto lg:opacity-100' : 'w-auto opacity-100'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] shrink-0 flex items-center justify-center font-bold shadow-lg">
            M
          </div>
          <span className={`font-bold whitespace-nowrap tracking-tight transition-opacity duration-300 ${collapsed ? "lg:hidden" : ""}`}>
            Micro Apps
          </span>
        </div>
        {/* Mobile close button */}
        <button onClick={onCloseMobile} className="lg:hidden p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => onCloseMobile()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[var(--color-primary)]/30" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? link.name : undefined}
            >
              <Icon size={20} className={`shrink-0 ${isActive ? "text-[var(--color-primary)]" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={`whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${collapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : ""}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section (Desktop Collapse) */}
      <div className="hidden lg:flex items-center justify-center p-4 border-t border-white/10 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-dvh z-40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
