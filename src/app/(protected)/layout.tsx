"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Linkedin, Instagram, Globe } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 w-full h-dvh flex overflow-hidden z-0 bg-[var(--color-base-100)]">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 z-10">
        <Header onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />

        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 relative">
          {/* Static Ambient Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div className="absolute -top-40 -left-72 w-[900px] h-[900px] rounded-full filter blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.14) 25%, rgba(249, 115, 22, 0.07) 50%, transparent 75%)' }} />
            <div className="absolute -top-16 -right-10 w-[420px] h-[420px] rounded-full filter blur-[40px]" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0.05) 45%, transparent 70%)' }} />
            <div className="absolute -bottom-28 -right-20 w-[550px] h-[550px] rounded-full filter blur-[40px]" style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 70%)' }} />
          </div>

          <div className="relative z-10 min-h-[calc(100vh-200px)]">
            {children}
          </div>

          {/* Footer */}
          <footer className="relative z-10 mt-16 pt-8 pb-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>
              &copy; {new Date().getFullYear()} AdminSmart 369. {language === "en" ? "All rights reserved." : "Todos los derechos reservados."}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                <Globe size={16} />
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
