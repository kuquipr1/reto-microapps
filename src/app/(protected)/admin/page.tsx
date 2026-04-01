import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, User, Clock } from "lucide-react";
import { AdminMetricsClient } from "@/components/admin/AdminMetricsClient";
import { AdminRecentActivityClient } from "@/components/admin/AdminRecentActivityClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("*, plans(name_en, name_es, slug)")
    .order("created_at", { ascending: false });

  const totalUsers = users?.length || 0;
  const usersWithPlan = users?.filter(u => u.plan_id !== null).length || 0;

  const { count: exactTotalExecutions } = await supabase
    .from("app_executions")
    .select("*", { count: "exact", head: true });
  const totalExecutions = exactTotalExecutions || 0;

  const { data: webhooks } = await supabase
    .from("webhook_logs")
    .select("id, created_at, status, event_type, normalized_payload, users(first_name, last_name, email)")
    .eq("status", "processed")
    .order("created_at", { ascending: false });
    
  let totalRevenue = 0;
  webhooks?.forEach(wh => {
    try {
      if (wh.normalized_payload && typeof wh.normalized_payload === 'object') {
        const payload = wh.normalized_payload as any;
        if (payload.amount) totalRevenue += Number(payload.amount);
      }
    } catch (e) {
      // Ignore parse errors on bad webhooks
    }
  });

  const { data: recentExecutions } = await supabase
    .from("app_executions")
    .select("id, created_at, users(first_name, last_name, email), micro_apps(name_en, name_es)")
    .order("created_at", { ascending: false })
    .limit(10);

  const activityList: any[] = [];

  users?.slice(0, 10).forEach(u => {
    activityList.push({
      id: `u-${u.id}`,
      type: "user",
      date: u.created_at,
      name: u.first_name ? `${u.first_name} ${u.last_name || ""}` : u.email
    });
  });

  recentExecutions?.forEach((e: any) => {
    activityList.push({
      id: `e-${e.id}`,
      type: "execution",
      date: e.created_at,
      name: e.users?.first_name ? `${e.users.first_name} ${e.users.last_name || ""}` : (e.users?.email || "Unknown"),
      appNameEn: e.micro_apps?.name_en || "App",
      appNameEs: e.micro_apps?.name_es || "App"
    });
  });

  webhooks?.slice(0, 10).forEach((w: any) => {
    let amount = 0;
    if (w.normalized_payload && typeof w.normalized_payload === 'object') {
      const payload = w.normalized_payload as any;
      if (payload.amount) amount = Number(payload.amount);
    }
    if (amount > 0 || w.event_type === 'payment.completed') {
      activityList.push({
        id: `w-${w.id}`,
        type: "payment",
        date: w.created_at,
        name: w.users?.first_name ? `${w.users.first_name} ${w.users.last_name || ""}` : (w.users?.email || "Unknown"),
        amount: amount
      });
    }
  });

  activityList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const finalActivities = activityList.slice(0, 10);

  return (
    <div className="space-y-8">
      <header className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-white/60 font-medium">
              Administra los usuarios registrados en el portal
            </p>
          </div>
          <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg">
            + Agregar Usuario
          </button>
        </div>
      </header>
      
      <AdminMetricsClient 
        metrics={{ totalUsers, usersWithPlan, totalExecutions, totalRevenue }} 
      />

      <GlassCard className="overflow-hidden border border-white/10 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Usuario</th>
                <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Rol</th>
                <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Plan</th>
                <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Fecha Registro</th>
                <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#EC4899] flex items-center justify-center font-bold text-white shadow-inner">
                        {u.first_name?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {u.first_name} {u.last_name}
                        </div>
                        <div className="text-white/40 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex flex-row items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === "admin" 
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30" 
                        : "bg-white/5 text-white/50 border border-white/10"
                    }`}>
                      {u.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${u.plans ? "text-white/80" : "text-white/30"}`}>
                      {u.plans?.name_es || "Sin Plan"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Clock size={14} />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/5">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AdminRecentActivityClient activities={finalActivities} />
    </div>
  );
}
