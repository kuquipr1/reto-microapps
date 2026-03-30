"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
