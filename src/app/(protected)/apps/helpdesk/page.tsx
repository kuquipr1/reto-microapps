"use client";

import { useEffect, useState, useMemo } from "react";
import { helpdeskService, Ticket } from "@/lib/services/helpdesk";
import { HelpdeskStats } from "@/components/helpdesk/HelpdeskStats";
import { TicketTable } from "@/components/helpdesk/TicketTable";
import { CreateTicketModal } from "@/components/helpdesk/CreateTicketModal";
import { TicketDetailModal } from "@/components/helpdesk/TicketDetailModal";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import {
  Plus,
  Headphones,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

type StatusFilter = "all" | Ticket["status"];
type PriorityFilter = "all" | Ticket["priority"];

export default function HelpdeskPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const fetchTickets = async () => {
    try {
      const data = await helpdeskService.getTickets();
      setTickets(data);
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este ticket permanentemente?")) return;
    try {
      await helpdeskService.deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast("Ticket eliminado", "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const handleStatusChange = async (id: string, status: Ticket["status"]) => {
    try {
      const resolvedAt = status === "resolved" ? new Date().toISOString() : null;
      const updated = await helpdeskService.updateTicket(id, { status, resolved_at: resolvedAt });
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (viewingTicket?.id === id) setViewingTicket(updated);
      toast(`Estado actualizado: ${status}`, "success");
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.customer_email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const statusTabs: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "Todos", count: tickets.length },
    { value: "open", label: "Abiertos", count: tickets.filter((t) => t.status === "open").length },
    { value: "in_progress", label: "En Progreso", count: tickets.filter((t) => t.status === "in_progress").length },
    { value: "resolved", label: "Resueltos", count: tickets.filter((t) => t.status === "resolved").length },
    { value: "closed", label: "Cerrados", count: tickets.filter((t) => t.status === "closed").length },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-white/40 animate-pulse text-sm">Cargando tickets...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Headphones className="text-[var(--color-primary)]" size={24} />
            HelpDesk
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Gestión de tickets de soporte y atención al cliente
          </p>
        </div>
        <GlowButton
          onClick={() => setIsCreateOpen(true)}
          className="text-sm flex items-center gap-2"
        >
          <Plus size={16} />
          Nuevo Ticket
        </GlowButton>
      </header>

      {/* Stats */}
      <HelpdeskStats tickets={tickets} />

      {/* Filters row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por título, cliente o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all"
          />
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-white/30" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] transition-all"
          >
            <option value="all">Todas las prioridades</option>
            <option value="critical">🔴 Crítica</option>
            <option value="high">🟠 Alta</option>
            <option value="medium">🟡 Media</option>
            <option value="low">🔵 Baja</option>
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-2xl w-fit flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              statusFilter === tab.value
                ? "bg-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                statusFilter === tab.value ? "bg-white/20" : "bg-white/10"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <TicketTable
        tickets={filtered}
        onView={setViewingTicket}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchTickets}
      />

      <TicketDetailModal
        ticket={viewingTicket}
        onClose={() => setViewingTicket(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
