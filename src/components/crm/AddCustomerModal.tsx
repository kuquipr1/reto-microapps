"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CustomerInput, crmService } from "@/lib/services/crm";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { X, Loader2, Mail, Phone, Building2, User } from "lucide-react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CustomerInput>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crmService.addCustomer(formData);
      toast("Customer added successfully", "success");
      onSuccess();
      onClose();
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
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
          <h2 className="text-xl font-bold text-white">{t("crm.add_customer")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.first_name")}</label>
              <Input
                required
                icon={<User size={18} />}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.last_name")}</label>
              <Input
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.email")}</label>
            <Input
              type="email"
              icon={<Mail size={18} />}
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.phone")}</label>
              <Input
                icon={<Phone size={18} />}
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.company")}</label>
              <Input
                icon={<Building2 size={18} />}
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{t("crm.form.status")}</label>
            <select
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
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
