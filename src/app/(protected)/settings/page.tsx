"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Settings, User, Bell, Shield, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  const categories = [
    { id: "profile", icon: User, label: language === "en" ? "Public Profile" : "Perfil Público" },
    { id: "account", icon: Bell, label: language === "en" ? "Account" : "Cuenta" },
    { id: "security", icon: Shield, label: language === "en" ? "Security" : "Seguridad" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-1000">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-4">
          <Settings className="text-[var(--color-primary)] animate-spin-slow" />
          {language === "en" ? "Settings" : "Configuración"}
        </h1>
        <p className="text-[var(--color-base-content)] opacity-60 max-w-2xl">
          {language === "en" 
            ? "Manage your account settings, privacy preferences, and portal personalization." 
            : "Gestiona la configuración de tu cuenta, preferencias de privacidad y personalización del portal."}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="w-full lg:w-72 space-y-2 shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  isActive 
                    ? "bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? "text-[var(--color-primary)]" : "text-white/40"} />
                  <span className="font-bold text-sm tracking-wide">{cat.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-white/40" />}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-grow flex justify-start">
          {activeTab === "profile" && <ProfileForm />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  const { language } = useLanguage();
  return (
    <GlassCard className="w-full max-w-2xl p-8 animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
        <Bell className="text-white" size={24} />
        {language === "en" ? "Account Settings" : "Opciones de Cuenta"}
      </h3>
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div>
            <h4 className="text-white font-bold">{language === "en" ? "Email Notifications" : "Notificaciones por Email"}</h4>
            <p className="text-xs text-white/50">{language === "en" ? "Receive updates about your activity" : "Recibe actualizaciones sobre tu actividad"}</p>
          </div>
          <div className="w-12 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
            <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-red-500/20 hover:border-red-500/30 transition-colors">
          <div>
            <h4 className="text-red-400 font-bold">{language === "en" ? "Delete Account" : "Eliminar Cuenta"}</h4>
            <p className="text-xs text-white/50">{language === "en" ? "Permanently delete your account" : "Eliminar permanentemente tu cuenta"}</p>
          </div>
          <button className="px-5 py-2.5 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-colors">
            {language === "en" ? "Delete" : "Eliminar"}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function SecuritySettings() {
  const { language } = useLanguage();
  return (
    <GlassCard className="w-full max-w-2xl p-8 animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-blue)]/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
        <Shield className="text-[var(--color-accent-blue)]" size={24} />
        {language === "en" ? "Security" : "Seguridad"}
      </h3>
      <div className="space-y-8 relative z-10">
        <div className="space-y-5 p-6 bg-black/20 rounded-3xl border border-white/5">
          <h4 className="text-white font-bold">{language === "en" ? "Change Password" : "Cambiar Contraseña"}</h4>
          <div className="space-y-3">
            <Input type="password" placeholder={language === "en" ? "Current password" : "Contraseña actual"} className="bg-black/30 border-white/5 focus:border-[var(--color-accent-blue)]/50 focus:bg-white/5" />
            <Input type="password" placeholder={language === "en" ? "New password" : "Nueva contraseña"} className="bg-black/30 border-white/5 focus:border-[var(--color-accent-blue)]/50 focus:bg-white/5" />
            <Input type="password" placeholder={language === "en" ? "Confirm new password" : "Confirmar nueva contraseña"} className="bg-black/30 border-white/5 focus:border-[var(--color-accent-blue)]/50 focus:bg-white/5" />
          </div>
          <div className="flex justify-end pt-2">
            <GlowButton>{language === "en" ? "Update Password" : "Actualizar Contraseña"}</GlowButton>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
          <div>
            <h4 className="text-white font-bold">{language === "en" ? "Two-Factor Authentication (2FA)" : "Autenticación de dos pasos (2FA)"}</h4>
            <p className="text-xs text-white/50">{language === "en" ? "Add an extra layer of security" : "Añade una capa extra de seguridad"}</p>
          </div>
          <GlowButton variant="ghost" className="text-sm px-4 py-2 border border-white/10 hover:border-white/20">
            {language === "en" ? "Enable" : "Activar"}
          </GlowButton>
        </div>
      </div>
    </GlassCard>
  );
}
