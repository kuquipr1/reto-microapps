"use client";

import { useState } from "react";
import { helpdeskService, TicketInput, Ticket } from "@/lib/services/helpdesk";
import { GlowButton } from "@/components/ui/GlowButton";
import { X, Plus } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY: TicketInput = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  category: "general",
  customer_name: "",
  customer_email: "",
  assigned_to: "",
};

export function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [form, setForm] = useState<TicketInput>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const set = (field: keyof TicketInput, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await helpdeskService.createTicket(form);
      setForm(EMPTY);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-all";

  const labelClass = "block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-panel rounded-2xl p-8 w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-[var(--color-primary)]" />
              Nuevo Ticket
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Crea un nuevo ticket de soporte</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass}>Título *</label>
            <input
              className={fieldClass}
              placeholder="Describe el problema brevemente..."
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Descripción *</label>
            <textarea
              className={`${fieldClass} min-h-[100px] resize-none`}
              placeholder="Explica el problema con detalle..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          {/* Priority + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prioridad</label>
              <select
                className={fieldClass}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as Ticket["priority"])}
              >
                <option value="low">🔵 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🟠 Alta</option>
                <option value="critical">🔴 Crítica</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Categoría</label>
              <select
                className={fieldClass}
                value={form.category}
                onChange={(e) => set("category", e.target.value as Ticket["category"])}
              >
                <option value="general">General</option>
                <option value="billing">Facturación</option>
                <option value="technical">Técnico</option>
                <option value="feature">Funcionalidad</option>
                <option value="bug">Bug</option>
              </select>
            </div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre del cliente</label>
              <input
                className={fieldClass}
                placeholder="Nombre completo"
                value={form.customer_name ?? ""}
                onChange={(e) => set("customer_name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email del cliente</label>
              <input
                type="email"
                className={fieldClass}
                placeholder="email@empresa.com"
                value={form.customer_email ?? ""}
                onChange={(e) => set("customer_email", e.target.value)}
              />
            </div>
          </div>

          {/* Assigned to */}
          <div>
            <label className={labelClass}>Asignado a</label>
            <input
              className={fieldClass}
              placeholder="Equipo o persona responsable"
              value={form.assigned_to ?? ""}
              onChange={(e) => set("assigned_to", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <GlowButton variant="ghost" type="button" onClick={onClose} className="flex-1">
              Cancelar
            </GlowButton>
            <GlowButton type="submit" isLoading={loading} className="flex-1">
              Crear Ticket
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
