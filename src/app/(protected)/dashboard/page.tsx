"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search, Grid, List, Sparkles } from "lucide-react";
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
  }, [supabase]);

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

  const firstName = user?.user_metadata?.first_name || "";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-[var(--color-primary)]" />
            {t("welcome.hello")}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-[var(--color-base-content)] opacity-60">
            {t("welcome.subheading")}
          </p>
        </div>
        
        <GlowButton onClick={handleLogout} variant="ghost" className="flex items-center gap-2 text-sm">
          <LogOut size={16} />
          {t("welcome.logout")}
        </GlowButton>
      </header>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
        <div className="w-full md:max-w-md">
          <Input
            placeholder={t("dashboard.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
          {(["all", "active", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                  ? "bg-[var(--color-primary)] text-white shadow-lg" 
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t(`dashboard.filter_${f}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats/Count */}
      <div className="mb-6 flex items-center justify-between text-sm text-[var(--color-base-content)] opacity-40">
        <span>{t("dashboard.apps_count").replace("{count}", filteredApps.length.toString())}</span>
      </div>

      {/* Grid Section */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <GlassCard className="py-20 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <Search size={40} className="text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white/60">
              {t("dashboard.no_results")}
            </h3>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
