"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { language } = useLanguage();
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-1000">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-4">
          <User className="text-[var(--color-primary)]" size={32} />
          {language === "en" ? "My Profile" : "Mi Perfil"}
        </h1>
        <p className="text-[var(--color-base-content)] opacity-60 max-w-2xl">
          {language === "en" 
            ? "Manage your personal information, avatar, and core account details." 
            : "Gestiona tu información personal, avatar y detalles principales de tu cuenta."}
        </p>
      </header>
      
      <div className="flex justify-start">
        <ProfileForm />
      </div>
    </div>
  );
}
