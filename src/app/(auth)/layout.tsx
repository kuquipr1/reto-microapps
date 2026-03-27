"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-base-100)] p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)] opacity-20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-pink)] opacity-20 blur-[100px] animate-pulse delay-700" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-[var(--color-accent-blue)] opacity-10 blur-[80px] animate-pulse delay-1000" />

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setLanguage("es")}
          className={`text-sm font-medium transition-colors ${language === "es" ? "text-white" : "text-white/50 hover:text-white/80"}`}
        >
          ES
        </button>
        <span className="text-white/30">|</span>
        <button
          onClick={() => setLanguage("en")}
          className={`text-sm font-medium transition-colors ${language === "en" ? "text-white" : "text-white/50 hover:text-white/80"}`}
        >
          EN
        </button>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
