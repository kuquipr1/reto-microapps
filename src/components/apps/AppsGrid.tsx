"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { PenTool, Mail, Briefcase, Share2, Video, LayoutGrid, Sparkles, FileText, MessageSquare, Zap, Lock } from "lucide-react";
import type { ComponentType } from "react";

const ICON_MAP: Record<string, any> = {
  PenTool, Mail, Briefcase, Share2, Video, LayoutGrid, Sparkles, FileText, MessageSquare, Zap
};

interface AppProps {
  slug: string;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  icon: string;
}

export function AppsGrid({ apps, accessibleSlugs }: { apps: AppProps[], accessibleSlugs: string[] }) {
  // Use the context properly
  const langContext = useLanguage();
  const currentLang = langContext?.language || "es";

  if (accessibleSlugs.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-black/40 border border-[var(--color-primary)]/40 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {currentLang === "en" ? "Choose a plan to unlock your apps" : "Elige un plan para desbloquear tus apps"}
        </h2>
        <p className="text-white/60 mb-6">
          {currentLang === "en" ? "You need an active subscription to start generating content." : "Necesitas una suscripción activa para empezar a generar contenido."}
        </p>
        <Link href="/plans">
          <GlowButton>
            {currentLang === "en" ? "View Plans" : "Ver Planes"}
          </GlowButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {apps.map((app) => {
        const isAccessible = accessibleSlugs.includes(app.slug);
        const IconComponent = ICON_MAP[app.icon] ?? Sparkles;

        if (isAccessible) {
          return (
            <Link key={app.slug} href={`/apps/${app.slug}`} className="block h-full group">
              <GlassCard className="h-full p-6 flex flex-col items-start bg-white/5 border border-white/10 hover:border-[var(--color-primary)]/50 hover:scale-[1.02] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center mb-4 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {currentLang === "en" ? app.name_en : app.name_es}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2">
                  {currentLang === "en" ? app.description_en : app.description_es}
                </p>
              </GlassCard>
            </Link>
          );
        }

        return (
          <Link key={app.slug} href="/plans" className="block h-full cursor-not-allowed pointer-events-auto group">
            <GlassCard className="h-full p-6 flex flex-col items-start bg-white/2 border border-white/5 opacity-50 relative hover:opacity-75 transition-opacity">
              <div className="absolute top-4 right-4">
                <Lock size={18} className="text-white/30" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-white/30">
                <IconComponent size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {currentLang === "en" ? app.name_en : app.name_es}
              </h3>
              <p className="text-white/40 text-sm line-clamp-2">
                {currentLang === "en" ? app.description_en : app.description_es}
              </p>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}
