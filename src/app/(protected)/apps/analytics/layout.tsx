"use client";

import React from "react";
import { CRMSidebar } from "@/components/crm/Sidebar"; // Reusing sidebar or could create another
import { LayoutDashboard, BarChart3, PieChart, Settings, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AnalyticsSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/apps/analytics" },
    { icon: BarChart3, label: "Growth", href: "/apps/analytics/growth" },
    { icon: PieChart, label: "Market", href: "/apps/analytics/market" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
          <ChevronLeft size={20} />
        </Link>
        <span className="font-bold text-white tracking-tight">DataPulse</span>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <AnalyticsSidebar />
      <main className="flex-grow overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
