"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ProductInput, inventoryService } from "@/lib/services/inventory";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { X, Loader2, Package, Tag, DollarSign, List } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    description: "",
    sku: "",
    price: 0,
    stock: 0,
    category: "General",
    image_url: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inventoryService.addProduct(formData);
      toast("Producto añadido correctamente", "success");
      onSuccess();
      onClose();
      setFormData({
        name: "",
        description: "",
        sku: "",
        price: 0,
        stock: 0,
        category: "General",
        image_url: null,
      });
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[var(--color-base-200)] border border-white/10 rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        <header className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">{t("inventory.add_product")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("inventory.form.name")}</label>
            <Input
              required
              icon={<Package size={18} />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Teclado Mecánico"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Descripción</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors min-h-[100px] resize-none"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">SKU</label>
              <Input
                icon={<Tag size={18} />}
                value={formData.sku || ""}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-123"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("inventory.categories")}</label>
              <Input
                icon={<List size={18} />}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Hardware"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("inventory.form.price")}</label>
              <Input
                type="number"
                step="0.01"
                icon={<DollarSign size={18} />}
                value={formData.price.toString()}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("inventory.form.stock")}</label>
              <Input
                type="number"
                value={formData.stock.toString()}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <GlowButton type="button" variant="ghost" className="flex-1" onClick={onClose}>
              {t("crm.form.cancel")}
            </GlowButton>
            <GlowButton type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t("crm.form.save")}
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
