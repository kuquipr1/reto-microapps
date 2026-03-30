"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, Clock, AlertCircle, FileText, Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";

const MOCK_PAYROLL = [
  { id: 1, employee: "Ana López", role: "Frontend Developer", base: 3500, deductions: 450, net: 3050, status: "pending", account: "**** 4589" },
  { id: 2, employee: "Carlos Ruiz", role: "Backend Developer", base: 4200, deductions: 580, net: 3620, status: "pending", account: "**** 1234" },
  { id: 3, employee: "Elena Martínez", role: "Product Manager", base: 5100, deductions: 710, net: 4390, status: "pending", account: "**** 8765" },
  { id: 4, employee: "Miguel Torres", role: "UX Designer", base: 3200, deductions: 350, net: 2850, status: "pending", account: "**** 9012" },
];

export default function PaymentsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [payments, setPayments] = useState(MOCK_PAYROLL);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalNet = payments.reduce((acc, curr) => acc + curr.net, 0);
  const totalDeductions = payments.reduce((acc, curr) => acc + curr.deductions, 0);
  const allProcessed = payments.every((p) => p.status === "processed");

  const handleProcessPayroll = () => {
    setIsProcessing(true);
    // Simulate API Call for processing mass payments
    setTimeout(() => {
      setPayments((prev) => prev.map((p) => ({ ...p, status: "processed" })));
      setIsProcessing(false);
      toast(language === "en" ? "Payroll processed successfully!" : "¡Nómina procesada exitosamente!", "success");
    }, 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <CreditCard className="text-[var(--color-primary)]" />
            {language === "en" ? "Mass Payments & Payroll" : "Pagos y Nómina Masiva"}
          </h1>
          <p className="text-[var(--color-base-content)] opacity-60 font-medium max-w-2xl">
            {language === "en" 
              ? "Review and process your team's salaries. Funds will be dispersed automatically." 
              : "Revisa y procesa los salarios de tu equipo. Los fondos se dispersarán automáticamente."}
          </p>
        </div>
        <div className="flex gap-4">
          <GlowButton variant="secondary" className="gap-2 border-white/10 hover:border-white/20">
            <Download size={18} />
            {language === "en" ? "Export XML" : "Exportar XML"}
          </GlowButton>
          <GlowButton 
            onClick={handleProcessPayroll} 
            disabled={isProcessing || allProcessed}
            className={`${allProcessed ? "opacity-50 grayscale" : ""}`}
          >
            {isProcessing 
              ? (language === "en" ? "Processing..." : "Procesando...") 
              : allProcessed 
                ? (language === "en" ? "Processed" : "Procesado") 
                : (language === "en" ? "Process Payroll" : "Procesar Nómina")}
          </GlowButton>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[var(--color-base-content)] opacity-60 text-sm font-bold uppercase tracking-wider mb-2">
                {language === "en" ? "Total Net Payout" : "Pago Neto Total"}
              </p>
              <h3 className="text-4xl font-black text-white">${totalNet.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-[var(--color-primary)]/20 rounded-xl">
              <CreditCard className="text-[var(--color-primary)]" size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-pink)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[var(--color-base-content)] opacity-60 text-sm font-bold uppercase tracking-wider mb-2">
                {language === "en" ? "Total Deductions" : "Deducciones Totales"}
              </p>
              <h3 className="text-4xl font-black text-white">${totalDeductions.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-[var(--color-accent-pink)]/20 rounded-xl">
              <FileText className="text-[var(--color-accent-pink)]" size={24} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[var(--color-base-content)] opacity-60 text-sm font-bold uppercase tracking-wider mb-2">
                {language === "en" ? "Employees" : "Empleados"}
              </p>
              <h3 className="text-4xl font-black text-white">{payments.length}</h3>
            </div>
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
               <AlertCircle size={24} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-lg font-bold text-white">
            {language === "en" ? "Current Period Breakdown" : "Desglose del Período Actual"}
          </h3>
          <span className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full text-xs font-bold">
            Oct 1 - Oct 15
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-[var(--color-base-content)] opacity-60">
                <th className="p-5 font-bold">{language === "en" ? "Employee" : "Empleado"}</th>
                <th className="p-5 font-bold">{language === "en" ? "Base Salary" : "Salario Base"}</th>
                <th className="p-5 font-bold">{language === "en" ? "Deductions" : "Deducciones"}</th>
                <th className="p-5 font-bold">{language === "en" ? "Net Payout" : "Pago Neto"}</th>
                <th className="p-5 font-bold">{language === "en" ? "Account" : "Cuenta"}</th>
                <th className="p-5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{p.employee}</span>
                      <span className="text-xs text-[var(--color-base-content)] opacity-60">{p.role}</span>
                    </div>
                  </td>
                  <td className="p-5 text-white/80">${p.base.toLocaleString()}</td>
                  <td className="p-5 text-red-400/80">-${p.deductions.toLocaleString()}</td>
                  <td className="p-5 font-black text-white">${p.net.toLocaleString()}</td>
                  <td className="p-5 text-sm font-mono text-white/50">{p.account}</td>
                  <td className="p-5">
                    <div className="flex justify-center items-center">
                      {p.status === "processed" ? (
                        <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={14} /> Processed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-xs font-bold">
                          <Clock size={14} /> Pending
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
