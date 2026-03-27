"use client";

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/crm/StatsGrid";
import { CustomerTable } from "@/components/crm/CustomerTable";
import { crmService, Customer } from "@/lib/services/crm";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, LayoutDashboard } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import Link from "next/link";
import { AddCustomerModal } from "@/components/crm/AddCustomerModal";

export default function CRMDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await crmService.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
        toast("Customer deleted", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  if (loading) return <div className="p-8 text-white/40">Loading CRM...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <LayoutDashboard className="text-[var(--color-primary)]" />
            {t("crm.dashboard")}
          </h2>
          <p className="text-sm text-white/40">Overview of your customer relationships</p>
        </div>
        <GlowButton onClick={() => setIsModalOpen(true)} className="text-sm flex items-center gap-2">
          <Plus size={16} />
          {t("crm.add_customer")}
        </GlowButton>
      </header>

      <StatsGrid customers={customers} />

      <div className="mb-6 flex justify-between items-end">
        <h3 className="text-lg font-bold text-white">Recent Customers</h3>
        <Link href="/apps/crm/customers" className="text-sm text-[var(--color-primary)] hover:underline uppercase tracking-widest font-bold">
          View All
        </Link>
      </div>

      <CustomerTable 
        customers={customers.slice(0, 5)} 
        onDelete={handleDelete}
        onEdit={() => {}}
      />

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
