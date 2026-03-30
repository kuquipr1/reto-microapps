"use client";

import React from "react";
import { LayoutDashboard, Users, CreditCard, Settings, ChevronLeft, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function PayrollSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/apps/payroll" },
    { icon: Users, label: t("payroll.employees") || "Empleados", href: "/apps/payroll/employees" },
    { icon: CreditCard, label: "Payments", href: "/apps/payroll/payments" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
          <ChevronLeft size={20} />
        </Link>
        <span className="font-bold text-white tracking-tight">FinanzFlow</span>
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
                  ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
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
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Empresa</p>
          <p className="text-sm font-bold text-white">Mi Micro-Empresa</p>
        </div>
      </div>
    </aside>
  );
}

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <PayrollSidebar />
      <main className="flex-grow overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
