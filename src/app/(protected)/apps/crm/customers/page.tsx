"use client";

import { useEffect, useState } from "react";
import { CustomerTable } from "@/components/crm/CustomerTable";
import { crmService, Customer } from "@/lib/services/crm";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Users, Search } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { AddCustomerModal } from "@/components/crm/AddCustomerModal";
import { EditCustomerModal } from "@/components/crm/EditCustomerModal";
import { StatsGrid } from "@/components/crm/StatsGrid";

export default function CustomerListPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchData = async () => {
    try {
      const data = await crmService.getCustomers();
      setCustomers(data);
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
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await crmService.deleteCustomer(id);
        setCustomers(prev => prev.filter(c => c.id !== id));
        toast("Cliente eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const filteredCustomers = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-white/40 animate-pulse">Cargando clientes...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Users className="text-[var(--color-primary)]" />
            {t("crm.customers")}
          </h2>
          <p className="text-sm text-white/40">
            {filteredCustomers.length} clientes · Gestiona toda tu información de clientes
          </p>
        </div>
        <GlowButton onClick={() => setIsAddModalOpen(true)} className="text-sm flex items-center gap-2">
          <Plus size={16} />
          {t("crm.add_customer")}
        </GlowButton>
      </header>

      <StatsGrid customers={customers} />

      <div className="mb-8 max-w-md">
        <Input
          placeholder={t("crm.search_customer")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} />}
          className="bg-white/5 border-white/10"
        />
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />

      <EditCustomerModal
        customer={editingCustomer}
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
