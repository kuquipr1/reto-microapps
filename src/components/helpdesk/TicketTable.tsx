"use client";

import { Ticket } from "@/lib/services/helpdesk";
import { PriorityBadge, StatusBadge, CategoryBadge } from "./TicketBadges";
import { Trash2, Eye, User, Calendar } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export function TicketTable({ tickets, onView, onDelete }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-16 text-center text-white/30">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-lg font-medium text-white/50">No hay tickets</p>
        <p className="text-sm mt-1">Todos los tickets han sido resueltos</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-white/30 font-medium">
        <span>Ticket</span>
        <span>Estado</span>
        <span>Prioridad</span>
        <span>Categoría</span>
        <span>Creado</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 hover:bg-white/5 transition-colors group items-center"
          >
            {/* Title + customer */}
            <div className="min-w-0">
              <button
                onClick={() => onView(ticket)}
                className="text-sm font-medium text-white hover:text-[var(--color-primary)] transition-colors text-left truncate block w-full"
              >
                #{ticket.id.toString().slice(-4).toUpperCase()} — {ticket.title}
              </button>
              {ticket.customer_name && (
                <div className="flex items-center gap-1 mt-0.5 text-xs text-white/40">
                  <User size={10} />
                  {ticket.customer_name}
                  {ticket.customer_email && (
                    <span className="text-white/20">· {ticket.customer_email}</span>
                  )}
                </div>
              )}
            </div>

            <div><StatusBadge status={ticket.status} /></div>
            <div><PriorityBadge priority={ticket.priority} /></div>
            <div><CategoryBadge category={ticket.category} /></div>

            <div className="flex items-center gap-1 text-xs text-white/30">
              <Calendar size={10} />
              {timeAgo(ticket.created_at)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onView(ticket)}
                className="p-1.5 rounded-lg hover:bg-[var(--color-primary)]/20 text-white/40 hover:text-[var(--color-primary)] transition-colors"
                title="Ver ticket"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => onDelete(ticket.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
