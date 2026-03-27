"use client";

import Link from "next/link";
import { ArrowRight, Box, Shield, Zap, Globe } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[var(--color-base-100)]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent-pink)] opacity-10 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] flex items-center justify-center text-white font-bold shadow-lg">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{t("app.name")}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setLanguage("es")}
              className={`text-sm font-medium transition-colors ${language === "es" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              ES
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLanguage("en")}
              className={`text-sm font-medium transition-colors ${language === "en" ? "text-white" : "text-white/50 hover:text-white/80"}`}
            >
              EN
            </button>
          </div>
          <Link href="/login">
            <GlowButton variant="ghost" className="text-sm">
              {t("login.title")}
            </GlowButton>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-7xl px-6 pt-20 pb-32 flex flex-col items-center text-center z-10">
        <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[var(--color-accent-blue)] backdrop-blur-md">
            Next.js 15 + Tailwind v4 + Supabase
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gradient mb-8 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {t("landing.title")}
        </h1>

        <p className="text-lg md:text-xl text-[var(--color-base-content)] opacity-70 max-w-2xl mb-12 font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {t("landing.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Link href="/signup">
            <GlowButton className="px-8 py-4 text-lg flex items-center gap-2">
              {t("landing.get_started")}
              <ArrowRight size={20} />
            </GlowButton>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
          <GlassCard className="p-8 text-left group hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform">
              <Box size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("landing.features.1.title")}</h3>
            <p className="text-sm text-[var(--color-base-content)] opacity-60 leading-relaxed">
              {t("landing.features.1.desc")}
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-left group hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-pink)]/20 flex items-center justify-center text-[var(--color-accent-pink)] mb-6 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("landing.features.2.title")}</h3>
            <p className="text-sm text-[var(--color-base-content)] opacity-60 leading-relaxed">
              {t("landing.features.2.desc")}
            </p>
          </GlassCard>

          <GlassCard className="p-8 text-left group hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-blue)]/20 flex items-center justify-center text-[var(--color-accent-blue)] mb-6 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t("landing.features.3.title")}</h3>
            <p className="text-sm text-[var(--color-base-content)] opacity-60 leading-relaxed">
              {t("landing.features.3.desc")}
            </p>
          </GlassCard>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
