"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "@/components/inventory/ProductCard";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { EditProductModal } from "@/components/inventory/EditProductModal";
import { inventoryService, Product } from "@/lib/services/inventory";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Package, Search, AlertTriangle, DollarSign, Tag } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

export default function InventoryDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      const data = await inventoryService.getProducts();
      setProducts(data);
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await inventoryService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        toast("Producto eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() =>
    products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }),
    [products, search, categoryFilter]
  );

  const totalValue = products.reduce((acc, p) => acc + Number(p.price) * p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  if (loading) return <div className="p-8 text-white/40 animate-pulse font-medium">Cargando inventario...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Package className="text-[var(--color-primary)]" />
            {t("inventory.title")}
          </h1>
          <p className="text-white/40 font-medium max-w-xl">
            Control total sobre tus productos y niveles de stock.
          </p>
        </div>
        <GlowButton onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6">
          <Plus size={20} />
          {t("inventory.add_product")}
        </GlowButton>
      </header>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl">
            <Tag size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Total SKUs</p>
            <p className="text-2xl font-black text-white">{products.length}</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
          <div className="p-3 bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] rounded-2xl">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Stock Valorizado</p>
            <p className="text-2xl font-black text-white">${totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className={`p-6 rounded-3xl border flex items-center gap-4 ${lowStockCount > 0 ? "bg-orange-500/10 border-orange-500/20" : "bg-white/5 border-white/10"}`}>
          <div className={`p-3 rounded-2xl ${lowStockCount > 0 ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-white/40"}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${lowStockCount > 0 ? "text-orange-400/60" : "text-white/20"}`}>Alertas Stock</p>
            <p className={`text-2xl font-black ${lowStockCount > 0 ? "text-orange-400" : "text-white"}`}>{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Search + Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow max-w-md">
          <Input
            placeholder={t("inventory.search_product")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={20} />}
            className="bg-white/5 border-white/10 h-12"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 h-12 rounded-2xl text-sm font-bold transition-all ${
              categoryFilter === "all"
                ? "bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 h-12 rounded-2xl text-sm font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/30 font-bold uppercase tracking-widest mb-6">
        {filteredProducts.length} productos encontrados
      </p>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onEdit={(p) => setEditingProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <Package size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/20 font-medium">No se encontraron productos.</p>
        </div>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />

      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
