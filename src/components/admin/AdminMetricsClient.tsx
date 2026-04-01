"use client";

import { Users, CreditCard, Activity, DollarSign } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";

interface MetricsProps {
  totalUsers: number;
  usersWithPlan: number;
  totalExecutions: number;
  totalRevenue: number;
}

export function AdminMetricsClient({ metrics }: { metrics: MetricsProps }) {
  const { language } = useLanguage();

  const cards = [
    {
      label: language === "en" ? "Total Users" : "Total Usuarios",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      label: language === "en" ? "Users with Plan" : "Usuarios con Plan",
      value: metrics.usersWithPlan,
      icon: CreditCard,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    {
      label: language === "en" ? "Total Executions" : "Ejecuciones Totales",
      value: metrics.totalExecutions,
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    {
      label: language === "en" ? "Simulated Revenue" : "Ingresos Simulados",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-400",
      bg: "bg-orange-400/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <GlassCard key={idx} className="p-6 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden flex flex-col justify-center">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">{card.label}</p>
              <h3 className="text-3xl font-extrabold text-white">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full filter blur-2xl opacity-20" style={{ backgroundColor: 'currentColor', color: 'inherit' }} />
        </GlassCard>
      ))}
    </div>
  );
}
