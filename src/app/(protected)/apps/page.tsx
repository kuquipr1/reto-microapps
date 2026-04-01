import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserAccessibleApps } from "@/lib/access";
import { AppsGrid } from "@/components/apps/AppsGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AppsDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accessibleSlugs = await getUserAccessibleApps(user.id);

  const { data: apps, error } = await supabase
    .from("micro_apps")
    .select("slug, name_en, name_es, description_en, description_es, icon")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching micro apps:", error);
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Mis Aplicaciones
        </h1>
        <p className="text-white/60 font-medium">
          Explora las herramientas de IA disponibles en tu plan
        </p>
      </header>

      <AppsGrid apps={apps || []} accessibleSlugs={accessibleSlugs} />
    </div>
  );
}
