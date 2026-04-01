import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, User, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("*, plans(name_en, name_es, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header className="mb-8">
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

      <GlassCard className="overflow-hidden border border-white/10">
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
    </div>
  );
}
