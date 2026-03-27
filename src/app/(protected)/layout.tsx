"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden bg-[var(--color-base-100)]">
      {/* Background Orbs */}
      <div className="fixed top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-pink)] opacity-10 blur-[120px] pointer-events-none" />
      
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 p-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10">
        <button
          onClick={() => setLanguage("es")}
          className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${language === "es" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/60"}`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${language === "en" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/60"}`}
        >
          EN
        </button>
      </div>

      <div className="relative z-10 w-full flex-grow">
        {children}
      </div>
    </div>
  );
}
