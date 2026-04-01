import { createClient } from "@/lib/supabase/server";
import { EmailClient } from "@/components/admin/EmailClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmailConfigPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch SMTP Settings (only 1 row expected)
  const { data: config } = await supabase
    .from("smtp_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  // Combine user first_name and last_name for the auto-fill fallback
  const adminName = [user.user_metadata?.first_name, user.user_metadata?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">Email Configuration</h1>
        <p className="text-white/60 font-medium">
          Configure your SMTP settings to enable welcome emails and notifications
        </p>
      </header>
      
      <EmailClient 
        initialConfig={config || {}} 
        adminEmail={user.email || ""}
        adminName={adminName || "Admin"}
      />
    </div>
  );
}
