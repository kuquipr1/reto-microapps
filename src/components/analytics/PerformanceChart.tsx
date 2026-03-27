"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";

interface PerformanceChartProps {
  data: number[];
  labels: string[];
  title: string;
}

export function PerformanceChart({ data, labels, title }: PerformanceChartProps) {
  const { t } = useLanguage();
  
  const max = Math.max(...data, 1);
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;
  
  const points = data.map((val, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (data.length - 1 || 1);
    const y = chartHeight - padding - (val / max) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <GlassCard className="p-8 w-full animate-in fade-in duration-1000">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
             <span className="text-xs text-white/40 font-medium">Trends</span>
           </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-auto drop-shadow-[0_0_20px_rgba(124,58,237,0.2)]"
          preserveAspectRatio="none"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent-pink)" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const y = chartHeight - padding - p * (chartHeight - padding * 2);
            return (
              <line 
                key={p} 
                x1={padding} 
                y1={y} 
                x2={chartWidth - padding} 
                y2={y} 
                stroke="white" 
                strokeOpacity="0.05" 
                strokeDasharray="4"
              />
            );
          })}

          {/* Area under the path */}
          <path
            d={`M ${padding},${chartHeight - padding} ${points} L ${chartWidth - padding},${chartHeight - padding} Z`}
            fill="url(#chartGradient)"
            className="animate-in fade-in duration-1000 delay-500"
          />

          {/* The Actual Line */}
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
            className="animate-chart-line"
            style={{ 
               strokeDasharray: 1000, 
               strokeDashoffset: 1000,
               animation: "dash 2s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            }}
          />

          {/* Data Points */}
          {data.map((val, i) => {
             const x = padding + (i * (chartWidth - padding * 2)) / (data.length - 1 || 1);
             const y = chartHeight - padding - (val / max) * (chartHeight - padding * 2);
             return (
               <circle 
                 key={i} 
                 cx={x} 
                 cy={y} 
                 r="4" 
                 fill="white" 
                 className="hover:r-6 transition-all cursor-pointer animate-in zoom-in duration-300"
                 style={{ animationDelay: `${i * 100}ms` }}
               />
             );
          })}
        </svg>

        {/* Labels */}
        <div className="flex justify-between px-[40px] mt-4">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </GlassCard>
  );
}
