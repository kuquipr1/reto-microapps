"use client";

import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <CreditCard className="text-[var(--color-primary)]" />
            Pagos (Próximamente)
          </h1>
          <p className="text-white/40 font-medium">Esta sección te permitirá procesar nóminas masivas.</p>
        </div>
      </header>
      
      <div className="p-12 border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center">
        <CreditCard size={48} className="text-white/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Módulo en Desarrollo</h3>
        <p className="text-white/40 max-w-md">El procesamiento de pagos múltiples y dispersión de fondos estará disponible muy pronto.</p>
      </div>
    </div>
  );
}
