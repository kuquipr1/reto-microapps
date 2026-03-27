"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { userService, UserProfile } from "@/lib/services/user";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, Save, Loader2 } from "lucide-react";

export function ProfileForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
        });
      } catch (error: any) {
        toast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userService.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      toast(t("settings.update_success"), "success");
      
      // Update local storage/context if needed, or just let the header re-fetch on reload
      // For now, next JS will handle re-validation if we use tags, but here we just update state
    } catch (error: any) {
      toast(t("settings.update_error"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white/40">Loading profile...</div>;

  return (
    <GlassCard className="max-w-2xl w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {formData.firstName?.[0] || profile?.email?.[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{t("settings.profile.title")}</h3>
          <p className="text-sm text-white/40">{t("settings.profile.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
              {t("signup.first_name")}
            </label>
            <Input
              icon={<User size={18} />}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
              className="bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
              {t("signup.last_name")}
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
              className="bg-white/5"
            />
          </div>
        </div>

        <div className="space-y-2 opacity-60">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
            {t("email.placeholder")}
          </label>
          <Input
            icon={<Mail size={18} />}
            value={profile?.email || ""}
            disabled
            className="bg-white/5 cursor-not-allowed"
          />
          <p className="text-[10px] text-white/40 italic px-1">El correo electrónico no puede ser modificado por ahora.</p>
        </div>

        <div className="flex justify-end pt-4">
          <GlowButton type="submit" disabled={saving} className="flex items-center gap-2 px-8">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {t("crm.form.save")}
          </GlowButton>
        </div>
      </form>
    </GlassCard>
  );
}
