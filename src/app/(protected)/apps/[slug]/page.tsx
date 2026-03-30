import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MicroAppRunner } from "@/components/micro-apps/MicroAppRunner";

export default async function DynamicMicroAppPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  const { data: app, error } = await supabase
    .from("micro_apps")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !app) {
    notFound();
  }

  return <MicroAppRunner app={app} />;
}
