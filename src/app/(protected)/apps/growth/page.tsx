"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { TrendingUp, Target, DollarSign, ArrowUpRight, ArrowDownRight, Users, Zap, BarChart } from "lucide-react";

export default function GrowthPage() {
  const { language } = useLanguage();

  const metrics = [
    { label: language === "en" ? "Monthly Recurring Revenue (MRR)" : "Ingresos Recurrentes (MRR)", value: "$124,500", trend: "+14.2%", up: true, color: "var(--color-primary)" },
    { label: language === "en" ? "Annual Contract Value (ACV)" : "Valor Anual Promedio (ACV)", value: "$4,200", trend: "+2.1%", up: true, color: "var(--color-accent-blue)" },
    { label: language === "en" ? "Customer Churn Rate" : "Tasa de Abandono (Churn)", value: "1.2%", trend: "-0.5%", up: true, color: "var(--color-accent-pink)" }, // Churn going down is good
    { label: language === "en" ? "Lifetime Value (LTV)" : "Valor de Vida (LTV)", value: "$38,400", trend: "+8.4%", up: true, color: "var(--color-accent-warm)" },
  ];

  const projectionData = [30, 45, 60, 85, 110, 150, 190, 240, 310, 400, 520, 680];
  const maxProjection = Math.max(...projectionData);
  const months = language === "en" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-[var(--color-primary)]" />
            {language === "en" ? "Growth Projections" : "Proyecciones de Crecimiento"}
          </h1>
          <p className="text-[var(--color-base-content)] opacity-60 font-medium max-w-2xl">
            {language === "en" 
              ? "Track your MRR, set aggressive financial goals, and monitor business expansion." 
              : "Rastrea tu MRR, establece metas financieras agresivas y monitorea la expansión."}
          </p>
        </div>
        <GlowButton className="gap-2">
          <Target size={18} />
          {language === "en" ? "Set New Goal" : "Establecer Meta"}
        </GlowButton>
      </header>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <GlassCard key={i} className="p-6 relative overflow-hidden group">
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700" 
              style={{ backgroundColor: metric.color }}
            />
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{metric.label}</p>
                <h3 className="text-2xl font-black text-white">{metric.value}</h3>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${metric.up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {metric.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.trend}
              </div>
            </div>
            
            {/* Mini trend line */}
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full w-[70%]" style={{ backgroundColor: metric.color }} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Advanced Projection Chart */}
      <GlassCard className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">
              {language === "en" ? "12-Month Financial Trajectory" : "Trayectoria Financiera a 12 Meses"}
            </h3>
            <p className="text-sm text-white/40">
              {language === "en" ? "Expected MRR compound growth" : "Crecimiento compuesto esperado de MRR"}
            </p>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-xs text-white/60">
              <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] opacity-50" />
              {language === "en" ? "Baseline" : "Base"}
            </span>
            <span className="flex items-center gap-2 text-xs text-white">
              <div className="w-3 h-3 rounded-full bg-[var(--color-accent-pink)] shadow-[0_0_10px_var(--color-accent-pink)]" />
              {language === "en" ? "Aggressive Goal" : "Meta Agresiva"}
            </span>
          </div>
        </div>

        {/* CSS Grid Bar Chart */}
        <div className="flex items-end gap-2 h-64 mt-4 relative">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 bottom-0 border-t border-white/5" />
          <div className="absolute inset-x-0 top-1/2 border-t border-white/5 border-dashed" />
          <div className="absolute inset-x-0 top-0 border-t border-white/5 border-dashed" />

          {projectionData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group z-10">
              <div className="relative w-full flex items-end justify-center h-full">
                {/* Aggressive Bar */}
                <div 
                  className="w-[60%] sm:w-[40%] bg-gradient-to-t from-[var(--color-accent-pink)]/40 to-[var(--color-accent-pink)] rounded-t-sm shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-700 ease-out group-hover:brightness-125"
                  style={{ height: `${(val / maxProjection) * 100}%` }}
                />
                {/* Baseline Bar (Behind) */}
                <div 
                  className="absolute bottom-0 w-[60%] sm:w-[40%] bg-[var(--color-primary)]/40 rounded-t-sm backdrop-blur-sm -z-10"
                  style={{ height: `${(val * 0.7 / maxProjection) * 100}%` }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs text-white pointer-events-none">
                  ${(val * 1.5).toFixed(1)}k
                </div>
              </div>
              <span className="text-[10px] text-white/50 mt-3 font-medium tracking-wide uppercase">{months[i]}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Goal Board & Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-8">
          <h3 className="text-lg font-bold text-white mb-6">
            {language === "en" ? "Q3 Strategic Objectives" : "Objetivos Estratégicos (Q3)"}
          </h3>
          <div className="space-y-4">
            {[
              { title: language === "en" ? "Reach $150k MRR" : "Alcanzar $150k MRR", prog: 85, color: "var(--color-primary)" },
              { title: language === "en" ? "Reduce Churn to 1.0%" : "Reducir Churn a 1.0%", prog: 40, color: "var(--color-accent-pink)" },
              { title: language === "en" ? "Close 5 Enterprise Deals" : "Cerrar 5 Contratos Enterprise", prog: 60, color: "var(--color-accent-blue)" }
            ].map((obj, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">{obj.title}</span>
                  <span className="text-xs font-mono text-white/50">{obj.prog}%</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${obj.prog}%`, backgroundColor: obj.color, boxShadow: `0 0 10px ${obj.color}88` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-[1px] mb-6 shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            <div className="w-full h-full bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center">
              <Zap className="text-yellow-400" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">
            {language === "en" ? "Unlock Expansion Module" : "Desbloquear Módulo de Expansión"}
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-sm">
            {language === "en" 
              ? "Integrate AI-driven predictive forecasting to discover hidden revenue opportunities." 
              : "Integra pronósticos predictivos con IA para descubrir oportunidades de ingresos ocultas."}
          </p>
          <GlowButton variant="ghost" className="border-yellow-500/30 text-yellow-400 hover:text-white hover:border-yellow-400 bg-yellow-400/10">
            {language === "en" ? "Upgrade to Enterprise" : "Mejorar a Enterprise"}
          </GlowButton>
        </GlassCard>
      </div>
    </div>
  );
}
