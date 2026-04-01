import { createClient } from "@/lib/supabase/server";
import { WebhooksClient } from "@/components/admin/WebhooksClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WebhooksAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch plans
  const { data: plans } = await supabase
    .from("plans")
    .select("slug")
    .eq("is_active", true)
    .order("sort_order");

  // Fetch webhook logs (last 20)
  const { data: logs } = await supabase
    .from("webhook_logs")
    .select(`
      id,
      source,
      event_type,
      status,
      created_at,
      raw_payload,
      normalized_payload,
      user:users(email)
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">Webhooks</h1>
        <p className="text-white/60 font-medium">
          Simula pagos y gestiona la integración de procesadores
        </p>
      </header>
      
      <WebhooksClient 
        planSlugs={plans?.map(p => p.slug) || []} 
        initialLogs={(logs as any) || []} 
      />
    </div>
  );
}
