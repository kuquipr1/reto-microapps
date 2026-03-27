"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Settings, User, Bell, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { t } = useLanguage();

  const categories = [
    { id: "profile", icon: User, label: t("settings.profile.title"), active: true },
    { id: "account", icon: Bell, label: t("settings.account.title"), active: false },
    { id: "security", icon: Shield, label: t("settings.security.title"), active: false },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-1000">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-4">
          <Settings className="text-[var(--color-primary)] animate-spin-slow" />
          {t("settings.title")}
        </h1>
        <p className="text-[var(--color-base-content)] opacity-60 max-w-2xl">
          Gestiona la configuración de tu cuenta, preferencias de privacidad y personalización del portal.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="w-full md:w-64 space-y-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  cat.active 
                    ? "bg-white/10 border-white/20 text-white shadow-xl" 
                    : "bg-white/5 border-transparent text-white/40 hover:bg-white/80 hover:text-white/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={cat.active ? "text-[var(--color-primary)]" : ""} />
                  <span className="font-bold text-sm">{cat.label}</span>
                </div>
                {cat.active && <ChevronRight size={16} />}
              </button>
            );
          })}
          
          <div className="pt-8">
             <Link href="/dashboard" className="text-sm text-[var(--color-accent-blue)] hover:underline flex items-center gap-2 px-4">
                ← Volver al Portal
             </Link>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow flex justify-center">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
