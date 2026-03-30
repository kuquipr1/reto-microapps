import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MicroAppRunner } from "@/components/micro-apps/MicroAppRunner";

export const dynamic = "force-dynamic";

export default async function DynamicMicroAppPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();
  
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
