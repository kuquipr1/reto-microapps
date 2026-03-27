"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Customer } from "@/lib/services/crm";

interface DistributionCardProps {
  customers: Customer[];
}

export function DistributionCard({ customers }: DistributionCardProps) {
  const { t } = useLanguage();

  const counts = {
    customer: customers.filter(c => c.status === "customer").length,
    lead: customers.filter(c => c.status === "lead").length,
    prospect: customers.filter(c => c.status === "prospect").length,
    inactive: customers.filter(c => c.status === "inactive").length,
  };

  const total = customers.length || 1;
  const stats = [
    { label: "Active", count: counts.customer, color: "var(--color-primary)", percentage: (counts.customer / total) * 100 },
    { label: "Leads", count: counts.lead, color: "var(--color-accent-pink)", percentage: (counts.lead / total) * 100 },
    { label: "Prospects", count: counts.prospect, color: "var(--color-accent-blue)", percentage: (counts.prospect / total) * 100 },
    { label: "Inactive", count: counts.inactive, color: "gray", percentage: (counts.inactive / total) * 100 },
  ];

  return (
    <GlassCard className="p-8 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-8">{t("analytics.status_dist")}</h3>
      
      <div className="flex-grow flex flex-col justify-center space-y-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/60">
              <span>{stat.label}</span>
              <span className="text-white">{stat.count} ({Math.round(stat.percentage)}%)</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out animate-in slide-in-from-left duration-1000"
                style={{ 
                  width: `${stat.percentage}%`, 
                  backgroundColor: stat.color,
                  boxShadow: `0 0 10px ${stat.color}44`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
        <span>Datos actualizados en tiempo real</span>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
        </div>
      </div>
    </GlassCard>
  );
}
