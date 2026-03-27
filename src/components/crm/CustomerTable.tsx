"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Customer } from "@/lib/services/crm";
import { MoreVertical, Mail, Phone, Building2, Trash2, Edit2 } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerTable({ customers, onDelete, onEdit }: CustomerTableProps) {
  const { t } = useLanguage();

  const statusColors = {
    customer: "bg-green-500/20 text-green-400 border-green-500/30",
    lead: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    prospect: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    inactive: "bg-white/10 text-white/40 border-white/20",
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">{t("crm.table.name")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">{t("crm.table.contact")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">{t("crm.table.company")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40">{t("crm.table.status")}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/40 text-right">{t("crm.table.actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {customers.map((customer) => (
            <tr key={customer.id} className="group hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] flex items-center justify-center text-white font-bold text-xs">
                    {customer.first_name[0]}{customer.last_name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{customer.first_name} {customer.last_name}</div>
                    <div className="text-xs text-white/40">ID: {customer.id.slice(0, 8)}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Mail size={12} /> {customer.email}
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Phone size={12} /> {customer.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Building2 size={14} className="text-white/40" />
                  {customer.company || "—"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColors[customer.status]}`}>
                  {customer.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(customer)}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(customer.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/40">No customers found.</p>
        </div>
      )}
    </div>
  );
}
