"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/inventory/ProductCard";
import { AddProductModal } from "@/components/inventory/AddProductModal";
import { inventoryService, Product } from "@/lib/services/inventory";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Package, Search, Filter } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

export default function InventoryDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await inventoryService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast("Producto eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-white/40 font-medium">Cargando inventario...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Package className="text-[var(--color-primary)]" />
            {t("inventory.title")}
          </h1>
          <p className="text-white/40 font-medium max-w-xl">
            Control total sobre tus productos y niveles de stock. Gestión inteligente para tu negocio.
          </p>
        </div>
        <GlowButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6">
          <Plus size={20} />
          {t("inventory.add_product")}
        </GlowButton>
      </header>

      {/* Filters Hub */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-grow max-w-md">
          <Input 
            placeholder={t("inventory.search_product")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={20} />}
            className="bg-white/5 border-white/10 h-12"
          />
        </div>
        <div className="flex gap-2">
            <button className="px-6 h-12 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white flex items-center gap-2 transition-all">
                <Filter size={18} />
                <span>{t("dashboard.filter_all")}</span>
            </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
         <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Total SKU</p>
            <p className="text-2xl font-black text-white">{products.length}</p>
         </div>
         <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Stock Valorizado</p>
            <p className="text-2xl font-black text-white">
                ${products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0).toLocaleString()}
            </p>
         </div>
         <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-[10px] uppercase font-bold text-orange-400/60 tracking-widest mb-1">Alertas Stock</p>
            <p className="text-2xl font-black text-orange-400">{products.filter(p => p.stock < 5).length}</p>
         </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onDelete={handleDelete}
            onEdit={() => {}}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-white/20 font-medium">No se encontraron productos en el inventario.</p>
        </div>
      )}

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
