"use client";

import { useEffect, useState } from "react";
import { EmployeeTable } from "@/components/payroll/EmployeeTable";
import { AddEmployeeModal } from "@/components/payroll/AddEmployeeModal";
import { payrollService, Employee } from "@/lib/services/payroll";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Wallet, Users, TrendingUp, DollarSign } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PayrollDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      try {
        await payrollService.deleteEmployee(id);
        setEmployees(employees.filter(e => e.id !== id));
        toast("Empleado eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  const totalMonthly = employees.reduce((acc, emp) => acc + Number(emp.salary), 0);

  if (loading) return <div className="p-8 text-white/40 font-medium italic">Calculando nómina...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Wallet className="text-emerald-400" />
            {t("payroll.title")}
          </h1>
          <p className="text-white/40 font-medium">Gestión simplificada de empleados y pagos mensuales.</p>
        </div>
        <GlowButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6">
          <Plus size={20} />
          {t("payroll.add_employee")}
        </GlowButton>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("payroll.total_monthly")}</p>
              <h3 className="text-3xl font-black text-white">${totalMonthly.toLocaleString()}</h3>
              <p className="text-xs text-white/20 mt-2 font-medium">Próximo pago en 4 días</p>
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
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1 font-bold">
                <Plus size={12} />
                Activos hoy
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
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Rentabilidad</p>
              <h3 className="text-3xl font-black text-white">94%</h3>
              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-bold">
                <TrendingUp size={12} />
                +2% este mes
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Lista de Personal
            <span className="text-xs font-medium text-white/20 bg-white/5 px-2 py-0.5 rounded-md">{employees.length}</span>
        </h2>
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
