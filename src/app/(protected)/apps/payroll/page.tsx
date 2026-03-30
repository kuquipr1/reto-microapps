"use client";

import { useEffect, useState, useMemo } from "react";
import { payrollService, Employee } from "@/lib/services/payroll";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Wallet, Users, TrendingUp, DollarSign, Building2, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function PayrollDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await payrollService.getEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);



  const stats = payrollService.calculatePayroll(employees);

  // Department breakdown
  const departments = useMemo(() => {
    const map = employees.reduce<Record<string, { count: number; total: number }>>((acc, emp) => {
      const dept = emp.department || "General";
      if (!acc[dept]) acc[dept] = { count: 0, total: 0 };
      acc[dept].count++;
      acc[dept].total += Number(emp.salary);
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [employees]);

  if (loading) return <div className="p-8 text-white/40 animate-pulse font-medium">Calculando nómina...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Wallet className="text-emerald-400" />
            {t("payroll.title") || "Nóminas y Pagos"}
          </h1>
          <p className="text-white/40 font-medium">Gestión simplificada de empleados y pagos mensuales.</p>
        </div>
        <Link href="/apps/payroll/employees" className="px-6 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-600/30 transition-all">
          Gestionar Trabajadores →
        </Link>
      </header>

      {/* KPI Stats */}
      <div id="payments" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <GlassCard className="p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("payroll.total_monthly")}</p>
              <h3 className="text-3xl font-black text-white">${stats.totalMonthly.toLocaleString()}</h3>
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-bold">
                <ArrowUpRight size={12} /> Salario anual: ${(stats.totalMonthly * 12).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-teal-500 bg-teal-500/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("payroll.employees")}</p>
              <h3 className="text-3xl font-black text-white">{employees.length}</h3>
              <p className="text-xs text-teal-400 mt-2 flex items-center gap-1 font-bold">
                <Building2 size={12} /> {departments.length} departamentos
              </p>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-l-blue-500 bg-blue-500/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Salario Promedio</p>
              <h3 className="text-3xl font-black text-white">
                ${Math.round(stats.averageSalary).toLocaleString()}
              </h3>
              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-bold">
                <TrendingUp size={12} /> Por empleado / mes
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Department Breakdown */}
      {departments.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Distribución por Departamento</h3>
          <div className="space-y-4">
            {departments.map((dept, i) => {
              const pct = stats.totalMonthly > 0 ? (dept.total / stats.totalMonthly) * 100 : 0;
              const colors = ["#10B981", "#14B8A6", "#3B82F6", "#8B5CF6", "#EC4899"];
              const color = colors[i % colors.length];
              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-white/70">{dept.name}</span>
                      <span className="text-white/30">({dept.count} emp.)</span>
                    </div>
                    <span className="text-white">${dept.total.toLocaleString()} · {Math.round(pct)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 animate-in slide-in-from-left"
                      style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}


    </div>
  );
}
