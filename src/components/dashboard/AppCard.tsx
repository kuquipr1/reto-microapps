"use client";

import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MicroApp } from "@/lib/data/apps";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

interface AppCardProps {
  app: MicroApp;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  business:    "from-violet-500/30 to-purple-500/10",
  productivity:"from-blue-500/30 to-cyan-500/10",
  finance:     "from-emerald-500/30 to-teal-500/10",
  tools:       "from-orange-500/30 to-amber-500/10",
};

const CATEGORY_ICON_BG: Record<string, string> = {
  business:    "from-violet-500 to-purple-600",
  productivity:"from-blue-500 to-cyan-500",
  finance:     "from-emerald-500 to-teal-500",
  tools:       "from-orange-500 to-amber-500",
};

const STATUS_BADGE: Record<string, string> = {
  active:      "bg-green-500/15 text-green-400 border-green-500/25",
  beta:        "bg-blue-500/15 text-blue-400 border-blue-500/25",
  upcoming:    "bg-purple-500/15 text-purple-400 border-purple-500/25",
  maintenance: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
};

export function AppCard({ app }: AppCardProps) {
  const { t } = useLanguage();
  const IconComponent = (Icons as any)[app.icon] as LucideIcon;
  const isAvailable = app.status === "active" || app.status === "beta";
  const gradient = CATEGORY_GRADIENTS[app.category] || CATEGORY_GRADIENTS.tools;
  const iconGradient = CATEGORY_ICON_BG[app.category] || CATEGORY_ICON_BG.tools;

  const CardContent = (
    <GlassCard
      className={`group relative flex flex-col h-full p-6 overflow-hidden transition-all duration-500
        hover:translate-y-[-6px] hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)]
        ${isAvailable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Top glow line */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${iconGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex justify-between items-start mb-6">
        {/* Icon */}
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${iconGradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
          {IconComponent && <IconComponent size={26} className="text-white" />}
        </div>

        {/* Status badge */}
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[app.status]}`}>
          {t(`status.${app.status}`)}
        </span>
      </div>

      {/* Info */}
      <div className="relative flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
          {t(app.nameKey)}
        </h3>
        <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed group-hover:text-white/70 transition-colors">
          {t(app.descriptionKey)}
        </p>
      </div>

      {/* CTA */}
      <div className="relative mt-auto">
        {isAvailable ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30 font-medium uppercase tracking-widest">
              {app.category}
            </span>
            <div className={`flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r ${iconGradient} bg-clip-text text-transparent group-hover:gap-2.5 transition-all duration-300`}>
              {t("landing.get_started")}
              <ArrowRight size={16} className={`text-white/60 group-hover:translate-x-1 transition-transform duration-300`} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30 font-medium uppercase tracking-widest">{app.category}</span>
            <div className="flex items-center gap-1.5 text-xs text-white/30 font-bold">
              <Lock size={12} />
              {t("status.upcoming")}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );

  if (isAvailable && app.route) {
    return <Link href={app.route} className="h-full block">{CardContent}</Link>;
  }
  return <div className="h-full">{CardContent}</div>;
}
