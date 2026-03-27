"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Employee } from "@/lib/services/payroll";
import { GlowButton } from "@/components/ui/GlowButton";
import { User, Briefcase, Mail, DollarSign, Trash2 } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">{t("payroll.employees")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">{t("payroll.form.role")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Departamento</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">{t("payroll.form.salary")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {employees.map((emp) => (
            <tr key={emp.id} className="group hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20">
                    {emp.first_name[0]}{emp.last_name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{emp.first_name} {emp.last_name}</div>
                    <div className="text-xs text-white/40 flex items-center gap-1">
                      <Mail size={10} /> {emp.email || "No email"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Briefcase size={14} className="text-white/40" />
                  {emp.role}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                {emp.department || "General"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 font-black text-white">
                  <DollarSign size={14} className="text-emerald-400" />
                  {Number(emp.salary).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  onClick={() => onDelete(emp.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="py-20 text-center text-white/20 font-medium italic">
          No hay empleados registrados...
        </div>
      )}
    </div>
  );
}
