"use client";

import { Settings, Save, Bell, Users, Database } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";

export default function CRMSettingsPage() {
  const { language } = useLanguage();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Settings className="text-[var(--color-primary)]" />
            {language === "en" ? "CRM Settings" : "Configuración del CRM"}
          </h1>
          <p className="text-[var(--color-base-content)] opacity-60 font-medium">
            {language === "en" 
              ? "Manage your customer relationship platform preferences." 
              : "Gestiona las preferencias de tu plataforma de relaciones con clientes."}
          </p>
        </div>
        <GlowButton className="gap-2">
           <Save size={18} />
           {language === "en" ? "Save Changes" : "Guardar Cambios"}
        </GlowButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-2 col-span-1">
          <div className="p-4 bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] rounded-xl flex items-center gap-3 font-bold cursor-pointer">
             <Database size={20} />
             {language === "en" ? "General Data" : "Datos Generales"}
          </div>
          <div className="p-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors rounded-xl flex items-center gap-3 font-bold cursor-pointer">
             <Users size={20} />
             {language === "en" ? "Team Access" : "Acceso del Equipo"}
          </div>
          <div className="p-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors rounded-xl flex items-center gap-3 font-bold cursor-pointer">
             <Bell size={20} />
             {language === "en" ? "Notifications" : "Notificaciones"}
          </div>
        </aside>

        <div className="col-span-1 md:col-span-2 space-y-6">
          <GlassCard className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-xl font-bold text-white mb-6">
              {language === "en" ? "Pipeline Preferences" : "Preferencias de Pipeline"}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--color-base-content)] opacity-60 mb-2 uppercase tracking-wider">
                  {language === "en" ? "Default Currency" : "Moneda por Defecto"}
                </label>
                <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all appearance-none cursor-pointer">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="MXN">MXN ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-base-content)] opacity-60 mb-2 uppercase tracking-wider">
                  {language === "en" ? "Sales Goal (Monthly)" : "Objetivo de Ventas (Mensual)"}
                </label>
                <Input type="number" defaultValue="50000" />
              </div>

              <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-white font-bold">
                    {language === "en" ? "Auto-assign Leads" : "Auto-asignar Prospectos"}
                  </h4>
                  <p className="text-xs text-white/50">
                    {language === "en" ? "Round-robin distribution for new entries" : "Distribución equitativa para nuevas entradas"}
                  </p>
                </div>
                <div className="w-12 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
