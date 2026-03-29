"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search, Sparkles, Grid3X3, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { AppCard } from "@/components/dashboard/AppCard";
import { microApps } from "@/lib/data/apps";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "upcoming">("all");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredApps = useMemo(() => {
    return microApps.filter((app) => {
      const matchesSearch =
        t(app.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(app.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && (app.status === "active" || app.status === "beta")) ||
        (filter === "upcoming" && app.status === "upcoming");
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter, t]);

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "";
  const activeCount = microApps.filter(a => a.status === "active" || a.status === "beta").length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">

      {/* Hero Header */}
      <header className="relative mb-12 rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-[var(--color-primary)]/20 via-white/5 to-[var(--color-accent-pink)]/10 border border-white/10">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 blur-[80px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-[var(--color-accent-pink)] opacity-10 blur-[60px] pointer-events-none rounded-full" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                {activeCount} apps activas
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-[var(--color-primary)]" size={28} />
              {t("welcome.hello")}{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-white/50 max-w-lg">
              {t("welcome.subheading")}
            </p>
          </div>
          <GlowButton onClick={handleLogout} variant="ghost" className="flex items-center gap-2 text-sm flex-shrink-0">
            <LogOut size={16} />
            {t("welcome.logout")}
          </GlowButton>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-5 mb-8 items-center justify-between">
        <div className="w-full md:max-w-sm">
          <Input
            placeholder={t("dashboard.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto">
          {(["all", "active", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                filter === f
                  ? "bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t(`dashboard.filter_${f}`)}
            </button>
          ))}
        </div>
      </div>

      {/* App count */}
      <div className="mb-5 flex items-center gap-2 text-xs text-white/20 font-bold uppercase tracking-widest">
        <Grid3X3 size={12} />
        {t("dashboard.apps_count").replace("{count}", filteredApps.length.toString())}
      </div>

      {/* Apps Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <GlassCard className="py-24 text-center">
          <div className="flex flex-col items-center">
            <div className="p-5 rounded-full bg-white/5 mb-4">
              <Search size={40} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white/40 mb-2">
              {t("dashboard.no_results")}
            </h3>
            <p className="text-sm text-white/20">Intenta con otra búsqueda o filtro</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
