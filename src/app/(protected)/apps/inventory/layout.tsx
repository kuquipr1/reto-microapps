"use client";

import React from "react";
import { LayoutDashboard, Package, Box, Settings, ChevronLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function InventorySidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/apps/inventory" },
    { icon: Box, label: t("inventory.categories"), href: "/apps/inventory/categories" },
    { icon: BarChart3, label: "Stats", href: "/apps/inventory/stats" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
          <ChevronLeft size={20} />
        </Link>
        <span className="font-bold text-white tracking-tight">StockMaster</span>
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

      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <p className="text-sm font-bold text-white">All Systems Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <InventorySidebar />
      <main className="flex-grow overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
