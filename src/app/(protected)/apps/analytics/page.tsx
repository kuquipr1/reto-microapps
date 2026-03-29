"use client";

import { useEffect, useState } from "react";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { DistributionCard } from "@/components/analytics/DistributionCard";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { GlassCard } from "@/components/ui/GlassCard";
import { crmService, Customer } from "@/lib/services/crm";
import { inventoryService, Product } from "@/lib/services/inventory";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { TrendingUp, TrendingDown, Users, Target, Activity, Package, DollarSign, BarChart2 } from "lucide-react";

export default function AnalyticsDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cData, pData] = await Promise.all([
          crmService.getCustomers(),
          inventoryService.getProducts(),
        ]);
        setCustomers(cData);
        setProducts(pData);
      } catch (error: any) {
        toast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Computed metrics
  const activeCustomers = customers.filter(c => c.status === "customer").length;
  const leads = customers.filter(c => c.status === "lead").length;
  const conversionRate = customers.length > 0
    ? ((activeCustomers / customers.length) * 100).toFixed(1)
    : "0.0";
  const totalInventoryValue = products.reduce((acc, p) => acc + Number(p.price) * p.stock, 0);
  const lowStockAlerts = products.filter(p => p.stock < 5).length;

  const monthlyData = [8, 14, 11, 22, 28, 38, customers.length + 40];
  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"];

  const statCards = [
    {
      label: t("analytics.total_customers"),
      value: customers.length,
      sub: `${activeCustomers} activos`,
      trend: "+12%",
      up: true,
      color: "var(--color-primary)",
      icon: <Users size={22} />,
    },
    {
      label: t("analytics.conversion_rate"),
      value: `${conversionRate}%`,
      sub: `${leads} leads activos`,
      trend: "+5.2%",
      up: true,
      color: "var(--color-accent-pink)",
      icon: <Target size={22} />,
    },
    {
      label: "Valor de Inventario",
      value: `$${(totalInventoryValue / 1000).toFixed(1)}k`,
      sub: `${products.length} SKUs totales`,
      trend: lowStockAlerts > 0 ? `${lowStockAlerts} alertas` : "Sin alertas",
      up: lowStockAlerts === 0,
      color: "var(--color-accent-blue)",
      icon: <Package size={22} />,
    },
    {
      label: "Ingresos Estimados",
      value: `$${((activeCustomers * 1200) / 1000).toFixed(1)}k`,
      sub: "Proyección mensual",
      trend: "+8.4%",
      up: true,
      color: "var(--color-accent-warm)",
      icon: <DollarSign size={22} />,
    },
  ];

  if (loading) return <div className="p-8 text-white/40 animate-pulse font-medium">Analizando datos...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <header className="mb-2">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <BarChart2 className="text-[var(--color-primary)]" />
          {t("analytics.dashboard")}
        </h1>
        <p className="text-white/40 font-medium">
          Métricas clave y análisis de rendimiento en tiempo real.
        </p>
      </header>

      {/* KPI Cards — 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <GlassCard key={card.label} className="p-6 group hover:bg-white/10 transition-colors duration-500" style={{ borderLeft: `3px solid ${card.color}` }}>
            <div className="flex justify-between items-start mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${card.color}22`, color: card.color }}
              >
                {card.icon}
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  card.up
                    ? "bg-green-500/10 text-green-400"
                    : "bg-orange-500/10 text-orange-400"
                }`}
              >
                {card.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-3xl font-black text-white mb-1">{card.value}</p>
            <p className="text-xs text-white/40">{card.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      {/* Category Chart */}
      <CategoryChart products={products} />
    </div>
  );
}
