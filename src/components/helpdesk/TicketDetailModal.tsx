"use client";

import { useState, useEffect } from "react";
import { Ticket, TicketComment, helpdeskService } from "@/lib/services/helpdesk";
import { PriorityBadge, StatusBadge, CategoryBadge } from "./TicketBadges";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  X,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Send,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Ticket["status"]) => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketDetailModal({ ticket, onClose, onStatusChange }: TicketDetailModalProps) {
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    if (!ticket) return;
    helpdeskService.getComments(ticket.id).then(setComments).catch(console.error);
  }, [ticket]);

  if (!ticket) return null;

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      const comment = await helpdeskService.addComment(ticket.id, newComment, isInternal);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    setChangingStatus(true);
    try {
      await onStatusChange(ticket.id, newStatus);
    } finally {
      setChangingStatus(false);
    }
  };

  const fieldClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-all";

  const STATUS_OPTIONS: Ticket["status"][] = ["open", "in_progress", "resolved", "closed"];
  const STATUS_LABELS = { open: "Abierto", in_progress: "En Progreso", resolved: "Resuelto", closed: "Cerrado" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-panel rounded-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-white/5">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs text-white/30 font-mono mb-1">
              #{ticket.id.toString().slice(-6).toUpperCase()}
            </p>
            <h2 className="text-lg font-bold text-white leading-snug">{ticket.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <CategoryBadge category={ticket.category} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4">
            {ticket.customer_name && (
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-white/30" />
                <div>
                  <p className="text-white/40 text-xs">Cliente</p>
                  <p className="text-white font-medium">{ticket.customer_name}</p>
                  {ticket.customer_email && <p className="text-white/40 text-xs">{ticket.customer_email}</p>}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-white/30" />
              <div>
                <p className="text-white/40 text-xs">Creado</p>
                <p className="text-white font-medium text-sm">{formatDate(ticket.created_at)}</p>
              </div>
            </div>
            {ticket.assigned_to && (
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-white/30" />
                <div>
                  <p className="text-white/40 text-xs">Asignado a</p>
                  <p className="text-white font-medium">{ticket.assigned_to}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-2 font-medium">Descripción</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/70 leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Status change */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-2 font-medium">Cambiar estado</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={ticket.status === s || changingStatus}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    ticket.status === s
                      ? "bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-[var(--color-primary)]"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                  } disabled:opacity-50`}
                >
                  {changingStatus && ticket.status === s ? (
                    <Loader2 size={10} className="animate-spin inline" />
                  ) : (
                    STATUS_LABELS[s]
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-3 font-medium flex items-center gap-1.5">
              <MessageSquare size={12} />
              Comentarios ({comments.length})
            </p>
            <div className="space-y-3">
              {comments.length === 0 && (
                <p className="text-sm text-white/20 text-center py-4">Sin comentarios aún</p>
              )}
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl p-4 text-sm ${
                    c.is_internal
                      ? "bg-orange-500/10 border border-orange-500/20"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-white/40 font-medium">Soporte</span>
                    <div className="flex items-center gap-2">
                      {c.is_internal && (
                        <span className="text-xs text-orange-400 flex items-center gap-1">
                          <Lock size={9} /> Interno
                        </span>
                      )}
                      <span className="text-xs text-white/20">{timeAgo(c.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="mt-4 space-y-2">
              <textarea
                className={`${fieldClass} w-full min-h-[80px] resize-none`}
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="accent-orange-500"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                  <Lock size={10} />
                  Nota interna (no visible al cliente)
                </label>
                <GlowButton
                  onClick={handleSendComment}
                  isLoading={sendingComment}
                  disabled={!newComment.trim()}
                  className="text-sm flex items-center gap-2 py-2 px-4"
                >
                  <Send size={14} />
                  Enviar
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
