import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";

import { PlansClient } from "@/components/plans/PlansClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("plan_id")
    .eq("id", user?.id || "")
    .single();

  const { data: plans } = await supabase
    .from("plans")
    .select("*, plan_apps(micro_apps(name_en, name_es, icon))")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Superpoderes para tu Negocio
        </h1>
        <p className="text-white/60 text-lg">
          Elige el plan con Inteligencia Artificial que mejor se adapte a tus necesidades.
        </p>
      </header>

      <PlansClient plans={plans || []} profile={profile || {}} />
    </div>
  );
}
