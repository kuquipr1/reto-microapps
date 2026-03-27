"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EmployeeInput, payrollService } from "@/lib/services/payroll";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { X, Loader2, User, Mail, Briefcase, Building2, DollarSign, Calendar } from "lucide-react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EmployeeInput>({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    department: "",
    salary: 0,
    hire_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await payrollService.addEmployee(formData);
      toast("Empleado añadido con éxito", "success");
      onSuccess();
      onClose();
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        department: "",
        salary: 0,
        hire_date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[var(--color-base-200)] border border-white/10 rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">{t("payroll.add_employee")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.first_name")}</label>
              <Input
                required
                icon={<User size={18} />}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.last_name")}</label>
              <Input
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.email")}</label>
            <Input
              type="email"
              icon={<Mail size={18} />}
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("payroll.form.role")}</label>
              <Input
                required
                icon={<Briefcase size={18} />}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Departamento</label>
              <Input
                icon={<Building2 size={18} />}
                value={formData.department || ""}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("payroll.form.salary")}</label>
              <Input
                type="number"
                required
                icon={<DollarSign size={18} />}
                value={formData.salary.toString()}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Fecha de Ingreso</label>
              <Input
                type="date"
                icon={<Calendar size={18} />}
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <GlowButton type="button" variant="ghost" className="flex-1" onClick={onClose}>
              {t("crm.form.cancel")}
            </GlowButton>
            <GlowButton type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t("crm.form.save")}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
