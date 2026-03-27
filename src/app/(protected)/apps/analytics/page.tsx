"use client";

import { useEffect, useState } from "react";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { DistributionCard } from "@/components/analytics/DistributionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { crmService, Customer } from "@/lib/services/crm";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { TrendingUp, Users, Target, Activity } from "lucide-react";

export default function AnalyticsDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await crmService.getCustomers();
        setCustomers(data);
      } catch (error: any) {
        toast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const monthlyData = [12, 19, 15, 25, 32, 45, 60];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  if (loading) return <div className="p-8 text-white/40 font-medium">Analyzing data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <Activity className="text-[var(--color-primary)]" />
          {t("analytics.dashboard")}
        </h1>
        <p className="text-white/40 font-medium">
          Métricas clave y análisis de rendimiento en tiempo real.
        </p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-l-4 border-l-[var(--color-primary)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{t("analytics.total_customers")}</p>
              <h3 className="text-3xl font-black text-white">{customers.length}</h3>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1 font-bold">
                <TrendingUp size={12} />
                +12% vs last month
              </p>
            </div>
            <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-[var(--color-accent-pink)]">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{t("analytics.conversion_rate")}</p>
              <h3 className="text-3xl font-black text-white">24.8%</h3>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1 font-bold">
                <TrendingUp size={12} />
                +5.2% vs last month
              </p>
            </div>
            <div className="p-3 bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)] rounded-xl">
              <Target size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-[var(--color-accent-blue)]">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Engaged Leads</p>
              <h3 className="text-3xl font-black text-white">42</h3>
              <p className="text-xs text-white/20 mt-2 flex items-center gap-1 font-bold">
                Stable performance
              </p>
            </div>
            <div className="p-3 bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] rounded-xl">
              <Activity size={24} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceChart 
            data={monthlyData} 
            labels={labels} 
            title={t("analytics.monthly_trend")} 
          />
        </div>
        <div>
          <DistributionCard customers={customers} />
        </div>
      </div>
    </div>
  );
}
