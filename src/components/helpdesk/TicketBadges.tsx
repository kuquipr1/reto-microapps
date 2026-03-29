"use client";

import { Ticket } from "@/lib/services/helpdesk";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  Minus,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const PRIORITY_CONFIG = {
  critical: {
    label: "Crítico",
    icon: AlertCircle,
    className: "bg-red-500/15 text-red-400 border border-red-500/30",
  },
  high: {
    label: "Alto",
    icon: AlertTriangle,
    className: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  },
  medium: {
    label: "Medio",
    icon: Minus,
    className: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  },
  low: {
    label: "Bajo",
    icon: ArrowDown,
    className: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  },
};

const STATUS_CONFIG = {
  open: {
    label: "Abierto",
    icon: Clock,
    className: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  },
  in_progress: {
    label: "En progreso",
    icon: Loader2,
    className: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    spin: true,
  },
  resolved: {
    label: "Resuelto",
    icon: CheckCircle2,
    className: "bg-green-500/15 text-green-400 border border-green-500/30",
  },
  closed: {
    label: "Cerrado",
    icon: XCircle,
    className: "bg-white/5 text-white/40 border border-white/10",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  billing: "Facturación",
  technical: "Técnico",
  feature: "Funcionalidad",
  bug: "Bug",
};

export function PriorityBadge({ priority }: { priority: Ticket["priority"] }) {
  const cfg = PRIORITY_CONFIG[priority];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", cfg.className)}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: Ticket["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", cfg.className)}>
      <Icon size={10} className={(cfg as any).spin ? "animate-spin" : ""} />
      {cfg.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Ticket["category"] }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10">
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

export { PRIORITY_CONFIG, STATUS_CONFIG, CATEGORY_LABELS };
