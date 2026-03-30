"use client";

import { useEffect, useState } from "react";
import { EmployeeTable } from "@/components/payroll/EmployeeTable";
import { AddEmployeeModal } from "@/components/payroll/AddEmployeeModal";
import { EditEmployeeModal } from "@/components/payroll/EditEmployeeModal";
import { payrollService, Employee } from "@/lib/services/payroll";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Users } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function EmployeesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      try {
        await payrollService.deleteEmployee(id);
        setEmployees(prev => prev.filter(e => e.id !== id));
        toast("Empleado eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  if (loading) return <div className="p-8 text-white/40 animate-pulse font-medium">Cargando empleados...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Users className="text-teal-400" />
            {t("payroll.employees") || "Empleados"}
          </h1>
          <p className="text-white/40 font-medium">Visualiza y gestiona a todo el personal de tu empresa.</p>
        </div>
        <GlowButton onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6">
          <Plus size={20} />
          {t("payroll.add_employee") || "Añadir Empleado"}
        </GlowButton>
      </header>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Lista de Personal
          <span className="text-xs font-medium text-white/20 bg-white/5 px-2 py-0.5 rounded-md">{employees.length}</span>
        </h2>
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          onEdit={(emp) => setEditingEmployee(emp)}
        />
      </div>

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchData} />
      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
