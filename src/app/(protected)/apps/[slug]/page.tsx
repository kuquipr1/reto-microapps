import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { MicroAppRunner } from "@/components/micro-apps/MicroAppRunner";
import { getUserAccessibleApps } from "@/lib/access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DynamicMicroAppPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const accessibleSlugs = await getUserAccessibleApps(user.id);
  if (!accessibleSlugs.includes(slug)) {
    redirect('/plans');
  }

  const { data: app, error } = await supabase
    .from("micro_apps")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !app) {
    console.error("MicroApp fetch error on slug:", slug, error);
    notFound();
  }

  return <MicroAppRunner app={app} />;
}
