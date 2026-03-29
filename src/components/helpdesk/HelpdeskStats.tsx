"use client";

import { Ticket } from "@/lib/services/helpdesk";
import { Ticket as TicketIcon, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface HelpdeskStatsProps {
  tickets: Ticket[];
}

export function HelpdeskStats({ tickets }: HelpdeskStatsProps) {
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const closed = tickets.filter((t) => t.status === "closed").length;
  const critical = tickets.filter((t) => t.priority === "critical" && t.status !== "closed" && t.status !== "resolved").length;

  const stats = [
    {
      label: "Abiertos",
      value: open,
      icon: Clock,
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
      border: "border-purple-500/20",
    },
    {
      label: "En Progreso",
      value: inProgress,
      icon: Loader2,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
      border: "border-blue-500/20",
      spin: true,
    },
    {
      label: "Resueltos",
      value: resolved,
      icon: CheckCircle2,
      color: "from-green-500/20 to-green-600/5",
      iconColor: "text-green-400",
      border: "border-green-500/20",
    },
    {
      label: "Cerrados",
      value: closed,
      icon: XCircle,
      color: "from-white/10 to-white/0",
      iconColor: "text-white/30",
      border: "border-white/10",
    },
    {
      label: "Críticos",
      value: critical,
      icon: TicketIcon,
      color: "from-red-500/20 to-red-600/5",
      iconColor: "text-red-400",
      border: "border-red-500/20",
      pulse: critical > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} border ${s.border} p-5 flex flex-col gap-3`}
          >
            {s.pulse && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${s.iconColor}`}>
              <Icon size={18} className={s.spin ? "animate-spin" : ""} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
