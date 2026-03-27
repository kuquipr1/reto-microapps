"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, UserPlus, UserCheck, Clock } from "lucide-react";
import { Customer } from "@/lib/services/crm";

interface StatsGridProps {
  customers: Customer[];
}

export function StatsGrid({ customers }: StatsGridProps) {
  const { t } = useLanguage();

  const stats = [
    {
      label: t("crm.stats.total"),
      value: customers.length,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: t("crm.stats.leads"),
      value: customers.filter(c => c.status === "lead").length,
      icon: UserPlus,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: t("crm.stats.active"),
      value: customers.filter(c => c.status === "customer").length,
      icon: UserCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: t("crm.stats.prospects"),
      value: customers.filter(c => c.status === "prospect").length,
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <GlassCard key={stat.label} className="p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-white/40 font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
            {/* Background design element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${stat.bg.replace('/10', '/40')}`} />
          </GlassCard>
        );
      })}
    </div>
  );
}
