"use client";

import { useState, useEffect } from "react";
import { Users, Activity, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Copy, PlayCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const { language } = useLanguage();

  const [userName, setUserName] = useState<string>("");
  const [greetingInfo, setGreetingInfo] = useState({ textEn: "Good morning", textEs: "Buenos días", emoji: "🌤️" });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || "User";
        setUserName(firstName);
      }
    };
    fetchUser();

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingInfo({ textEn: "Good morning", textEs: "Buenos días", emoji: "☀️" });
    } else if (hour < 18) {
      setGreetingInfo({ textEn: "Good afternoon", textEs: "Buenas tardes", emoji: "🌤️" });
    } else {
      setGreetingInfo({ textEn: "Good evening", textEs: "Buenas noches", emoji: "🌙" });
    }
  }, []);

  const stats = [
    {
      title: language === "en" ? "Total Users" : "Usuarios Totales",
      value: "24,593",
      trend: "+12.5%",
      isPositive: true,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400"
    },
    {
      title: language === "en" ? "Active Sessions" : "Sesiones Activas",
      value: "1,204",
      trend: "+5.2%",
      isPositive: true,
      icon: Activity,
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400"
    },
    {
      title: language === "en" ? "Conversions" : "Conversiones",
      value: "3.42%",
      trend: "-1.1%",
      isPositive: false,
      icon: TrendingUp,
      color: "from-pink-500/20 to-pink-600/5",
      iconColor: "text-pink-400"
    },
    {
      title: language === "en" ? "Revenue" : "Ingresos",
      value: "$45,231.89",
      trend: "+8.4%",
      isPositive: true,
      icon: DollarSign,
      color: "from-emerald-500/20 to-emerald-600/5",
      iconColor: "text-emerald-400"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Jenkins",
      action: language === "en" ? "created a new project" : "creó un nuevo proyecto",
      project: "Project Apollo",
      time: language === "en" ? "2 hours ago" : "hace 2 horas",
      initials: "SJ",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      user: "Michael Chen",
      action: language === "en" ? "completed task" : "completó la tarea",
      project: "Q3 Marketing",
      time: language === "en" ? "4 hours ago" : "hace 4 horas",
      initials: "MC",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      user: "Elena Rodriguez",
      action: language === "en" ? "uploaded 3 files to" : "subió 3 archivos a",
      project: "Design Assets",
      time: language === "en" ? "5 hours ago" : "hace 5 horas",
      initials: "ER",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      user: "David Smith",
      action: language === "en" ? "commented on" : "comentó en",
      project: "API Integration",
      time: language === "en" ? "Yesterday" : "Ayer",
      initials: "DS",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  // Using static arrays to avoid hydration mismatched dates
  const chartData = [15, 30, 25, 45, 35, 60, 50, 75, 65, 90, 85, 100];
  const maxVal = Math.max(...chartData);

  const barChartData = [40, 70, 45, 90, 60, 80, 50];
  const maxBarVal = Math.max(...barChartData);
  const labels = language === "en" 
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] 
    : ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-12">
      {/* Greeting Section */}
      <div className="mb-2 animate-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          {greetingInfo.emoji} {language === "en" ? greetingInfo.textEn : greetingInfo.textEs}, <span className="text-[var(--color-primary)]">{userName || "..."}</span>
        </h1>
        <p className="text-white/60 mt-2 text-sm md:text-base font-medium">
          {language === "en" ? "What will you create today?" : "¿Qué vas a crear hoy?"}
        </p>
      </div>

      {/* Header section inside page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {language === "en" ? "Dashboard Overview" : "Resumen del Dashboard"}
          </h1>
          <p className="text-sm text-white/50">
            {language === "en" ? "Welcome back! Here's what's happening." : "¡Bienvenido de nuevo! Esto es lo que está pasando."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GlowButton variant="ghost" className="px-4 py-2 text-sm">
            {language === "en" ? "Download Report" : "Descargar Reporte"}
          </GlowButton>
          <GlowButton className="px-4 py-2 text-sm flex items-center gap-2">
            <PlayCircle size={16} />
            {language === "en" ? "New Campaign" : "Nueva Campaña"}
          </GlowButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="p-5 flex flex-col justify-between hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="p-2.5 rounded-xl border border-white/5 bg-white/5">
                  <Icon size={20} className={stat.iconColor} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.isPositive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                }`}>
                  {stat.trend}
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              
              <div className="mt-4 relative z-10">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">{language === "en" ? "Growth Trend" : "Tendencia de Crecimiento"}</h3>
              <p className="text-xs text-white/50">{language === "en" ? "Last 12 months" : "Últimos 12 meses"}</p>
            </div>
            <button className="text-white/40 hover:text-white p-2"><MoreHorizontal size={20} /></button>
          </div>
          
          <div className="flex-1 flex items-end gap-2 shrink-0 h-48 mt-auto">
            {chartData.map((val, i) => {
              const height = (val / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group">
                  <div 
                    className="w-full rounded-t-sm bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)] transition-all duration-500 opacity-70 group-hover:opacity-100 relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {val}k
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">{language === "en" ? "Weekly Activity" : "Actividad Semanal"}</h3>
              <p className="text-xs text-white/50">{language === "en" ? "User engagement" : "Interacción de usuario"}</p>
            </div>
            <button className="text-white/40 hover:text-white p-2"><MoreHorizontal size={20} /></button>
          </div>
          
          <div className="flex-1 flex items-end gap-3 shrink-0 h-48 mt-auto">
            {barChartData.map((val, i) => {
              const height = (val / maxBarVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full h-full flex items-end relative overflow-hidden rounded-t-md bg-white/5">
                    <div 
                      className="w-full rounded-t-md bg-gradient-to-t from-[var(--color-accent-pink)]/40 to-[var(--color-accent-pink)] transition-all duration-500 opacity-80 group-hover:opacity-100"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/40 group-hover:text-white/70">{labels[i]}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest pl-2">
            {language === "en" ? "Quick Actions" : "Acciones Rápidas"}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {[
              { title: language === "en" ? "Add User" : "Añadir Usuario", color: "from-blue-500/20" },
              { title: language === "en" ? "Generate Report" : "Generar Reporte", color: "from-purple-500/20" },
              { title: language === "en" ? "System Config" : "Configurar Sistema", color: "from-pink-500/20" },
              { title: language === "en" ? "Review Logs" : "Revisar Logs", color: "from-emerald-500/20" }
            ].map((action, i) => (
              <GlassCard key={i} className={`p-4 hover:bg-gradient-to-r ${action.color} to-transparent cursor-pointer transition-all`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{action.title}</span>
                  <Copy size={14} className="text-white/30" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{language === "en" ? "Recent Activity" : "Actividad Reciente"}</h3>
            <span className="text-xs text-[var(--color-primary)] font-bold cursor-pointer hover:underline">
              {language === "en" ? "View All" : "Ver Todo"}
            </span>
          </div>

          <div className="space-y-6 flex-1">
            {recentActivity.map((item, i) => (
              <div key={item.id} className="flex gap-4 relative">
                {/* Timeline connector */}
                {i !== recentActivity.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-white/10" />
                )}
                
                {/* Avatar */}
                <div className="relative z-10 shrink-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xs font-bold text-white shadow-lg border border-white/20`}>
                    {item.initials}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <p className="text-sm text-white/80">
                    <span className="font-bold text-white">{item.user}</span>{" "}
                    {item.action}{" "}
                    <span className="font-medium text-[var(--color-accent-blue)]">{item.project}</span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
