"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Product } from "@/lib/services/inventory";
import { GlassCard } from "@/components/ui/GlassCard";
import { Package, AlertTriangle, MoreVertical, Edit2, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useLanguage();
  const isLowStock = product.stock < 5;

  return (
    <GlassCard className="p-4 group relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-[var(--color-primary)] transition-colors duration-500`}>
          <Package size={24} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(product)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(product.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
           <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{product.category}</span>
           {isLowStock && (
             <span className="flex items-center gap-1 text-[9px] font-bold text-orange-400 uppercase tracking-tight bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
               <AlertTriangle size={10} /> {t("inventory.low_stock")}
             </span>
           )}
        </div>
        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{product.name}</h4>
        <p className="text-sm text-white/40 line-clamp-2 mb-4 h-10">{product.description || "Sin descripción"}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{t("inventory.form.price")}</p>
          <p className="text-lg font-black text-white">${Number(product.price).toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Stock</p>
          <p className={`text-lg font-black ${isLowStock ? "text-orange-400" : "text-white"}`}>{product.stock}</p>
        </div>
      </div>

      {/* Glossy overlay effect on hover */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </GlassCard>
  );
}
