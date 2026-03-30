"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Input } from "@/components/ui/Input";

export function Header({ onToggleMobileSidebar }: { onToggleMobileSidebar: () => void }) {
  const router = useRouter();
  const { language } = useLanguage();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";
  const initials = firstName.substring(0, 2).toUpperCase();

  return (
    <header className="h-16 shrink-0 relative z-30 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A0520]/80 backdrop-blur-md flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:block w-64 max-w-sm">
          <Input 
            placeholder={language === 'en' ? "Search... (⌘K)" : "Buscar... (⌘K)"} 
            icon={<Search size={18} />} 
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2 w-80 bg-[#0A0520] border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-50">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-white tracking-tight">{language === 'en' ? 'Notifications' : 'Notificaciones'}</h3>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70">1 {language === 'en' ? 'new' : 'nueva'}</span>
                </div>
                <div className="p-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-l-2 border-[var(--color-primary)]">
                  <p className="text-sm text-white font-medium mb-1">{language === 'en' ? 'System Update' : 'Actualización del Sistema'}</p>
                  <p className="text-xs text-white/50">{language === 'en' ? 'Welcome to the Micro-Apps Portal!' : '¡Bienvenido al Portal de Micro-Apps!'}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-blue)] flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform shadow-lg border border-white/10">
              <span className="text-xs font-bold text-white shrink-0 tracking-widest">{initials}</span>
            </div>
          </button>

          {showProfileDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-[#0A0520] border border-white/20 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-bold text-white truncate">{firstName}</p>
                  <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/settings" className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white flex items-center gap-2 hover:bg-white/10 rounded-lg transition-colors">
                    <UserIcon size={16} />
                    {language === 'en' ? 'Profile' : 'Perfil'}
                  </Link>
                  <Link href="/settings" className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white flex items-center gap-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Settings size={16} />
                    {language === 'en' ? 'Settings' : 'Configuración'}
                  </Link>
                  <div className="h-px bg-white/10 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-2 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
