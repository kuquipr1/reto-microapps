"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Product } from "@/lib/services/inventory";

interface CategoryChartProps {
  products: Product[];
}

export function CategoryChart({ products }: CategoryChartProps) {
  // Count products by category
  const categoryMap = products.reduce<Record<string, { count: number; value: number }>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, value: 0 };
    acc[p.category].count++;
    acc[p.category].value += Number(p.price) * p.stock;
    return acc;
  }, {});

  const categories = Object.entries(categoryMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxCount = Math.max(...categories.map(c => c.count), 1);

  const colors = [
    "var(--color-primary)",
    "var(--color-accent-pink)",
    "var(--color-accent-blue)",
    "var(--color-accent-warm)",
    "#34D399",
    "#A78BFA",
  ];

  if (products.length === 0) {
    return (
      <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[240px]">
        <p className="text-white/20 text-sm font-medium">Sin productos para analizar</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Stock por Categoría</h3>
        <span className="text-xs text-white/30 font-bold uppercase tracking-widest">{categories.length} categorías</span>
      </div>

      <div className="space-y-5">
        {categories.map((cat, i) => (
          <div key={cat.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-sm font-bold text-white/80">{cat.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="font-bold text-white/60">{cat.count} SKU</span>
                <span>${cat.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out animate-in slide-in-from-left duration-700"
                style={{
                  width: `${(cat.count / maxCount) * 100}%`,
                  backgroundColor: colors[i % colors.length],
                  boxShadow: `0 0 12px ${colors[i % colors.length]}66`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
