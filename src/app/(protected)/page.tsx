"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const firstName = user?.user_metadata?.first_name || "";

  return (
    <div className="w-full flex justify-center animate-in zoom-in-95 duration-700">
      <div className="relative w-full max-w-3xl">
        {/* Animated Background Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <GlassCard className="max-w-none p-12 text-center bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="inline-block mb-6 relative">
            <span className="relative z-10 inline-flex items-center rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary-content)] backdrop-blur-md">
              <span className="mr-2 h-2 w-2 rounded-full bg-[var(--color-accent-pink)] animate-pulse" />
              {t("welcome.coming_soon")}
            </span>
            <div className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-20 blur-md animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gradient mb-6 tracking-tight">
            {t("welcome.greeting")}
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-base-content)] opacity-80 mb-10 font-light">
            {t("welcome.subheading")}
          </p>

          <div className="py-6 border-y border-white/10 mb-8">
            <h2 className="text-2xl font-semibold text-white">
              {t("welcome.hello")}{firstName ? `, ${firstName}` : ""} 👋
            </h2>
          </div>

          <p className="text-sm text-[var(--color-base-content)] opacity-60 mb-10">
            {t("welcome.footer")}
          </p>

          <GlowButton onClick={handleLogout} variant="ghost" className="mx-auto flex items-center gap-2">
            <LogOut size={18} />
            {t("welcome.logout")}
          </GlowButton>
        </GlassCard>
      </div>
    </div>
  );
}
