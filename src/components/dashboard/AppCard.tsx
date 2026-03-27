"use client";

import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MicroApp } from "@/lib/data/apps";
import Link from "next/link";

interface AppCardProps {
  app: MicroApp;
}

export function AppCard({ app }: AppCardProps) {
  const { t } = useLanguage();
  
  // Dynamically get the icon from lucide-react
  const IconComponent = (Icons as any)[app.icon] as LucideIcon;

  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    upcoming: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const isAvailable = app.status === "active" || app.status === "beta";

  return (
    <GlassCard className="group relative flex flex-col h-full p-6 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-4px]">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-gradient-to-br transition-all duration-500 group-hover:scale-110 ${
          app.status === "active" ? "from-[var(--color-primary)]/20 to-[var(--color-accent-blue)]/20" : "from-white/5 to-white/10"
        }`}>
          {IconComponent && <IconComponent size={28} className={app.status === "active" ? "text-[var(--color-primary-content)]" : "text-white/60"} />}
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${statusColors[app.status]}`}>
          {t(`status.${app.status}`)}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all">
        {t(app.nameKey)}
      </h3>
      
      <p className="text-sm text-[var(--color-base-content)] opacity-60 mb-8 line-clamp-2 flex-grow">
        {t(app.descriptionKey)}
      </p>

      <div className="mt-auto">
        {isAvailable && app.route ? (
          <Link href={app.route}>
            <GlowButton className="w-full text-sm py-2">
              {t("landing.get_started")}
            </GlowButton>
          </Link>
        ) : (
          <GlowButton disabled className="w-full text-sm py-2 opacity-50 grayscale">
            {t("status.upcoming")}
          </GlowButton>
        )}
      </div>

      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none rounded-[inherit]" />
    </GlassCard>
  );
}
