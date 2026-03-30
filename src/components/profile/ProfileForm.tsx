"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { userService, UserProfile } from "@/lib/services/user";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, Save, Loader2, Camera, UserSquare } from "lucide-react";

export function ProfileForm() {
  const { language } = useLanguage();
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
      toast(
        language === "en" ? "Profile updated successfully." : "Perfil actualizado con éxito.", 
        "success" 
      );
      
      // Update local storage/context if needed, or just let the header re-fetch on reload
    } catch (error: any) {
      toast(
        language === "en" ? "Error updating profile." : "Error al actualizar el perfil.", 
        "error" 
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-in fade-in duration-500 w-full max-w-2xl">
      <Loader2 size={32} className="text-[var(--color-primary)] animate-spin" />
      <span className="text-white/40 font-medium">
        {language === "en" ? "Loading profile..." : "Cargando perfil..."}
      </span>
    </div>
  );

  return (
    <GlassCard className="max-w-2xl w-full p-8 animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
      {/* Decorative gradient blob inside card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 relative z-10">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[var(--color-primary)]/20 border-2 border-white/10 group-hover:scale-105 transition-transform">
            {formData.firstName?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || <User size={32} />}
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <UserSquare className="text-[var(--color-primary)]" size={24} />
            {language === "en" ? "Public Profile" : "Perfil Público"}
          </h3>
          <p className="text-sm text-white/50 mt-1 max-w-xs">
            {language === "en" 
              ? "Manage your personal information and how others see you." 
              : "Gestiona tu información personal y cómo otros te ven."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
              {language === "en" ? "First Name" : "Nombre"}
            </label>
            <Input
              icon={<User size={18} className="text-[var(--color-primary)]" />}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder={language === "en" ? "John" : "Juan"}
              className="bg-black/20 border-white/10 focus:border-[var(--color-primary)]/50 focus:bg-white/5 transition-all text-white h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
              {language === "en" ? "Last Name" : "Apellido"}
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder={language === "en" ? "Doe" : "Pérez"}
              className="bg-black/20 border-white/10 focus:border-[var(--color-primary)]/50 focus:bg-white/5 transition-all text-white h-12"
            />
          </div>
        </div>

        <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
          <div className="space-y-2 opacity-70">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1">
              {language === "en" ? "Email Address" : "Correo Electrónico"}
            </label>
            <Input
              icon={<Mail size={18} className="text-white/50" />}
              value={profile?.email || ""}
              disabled
              className="bg-black/40 cursor-not-allowed border-transparent text-white/60 h-12"
            />
            <p className="text-[11px] text-[var(--color-accent-blue)] font-medium pl-1 mt-1">
              {language === "en" 
                ? "Your email address cannot be changed at this time." 
                : "El correo electrónico no puede ser modificado por ahora."}
            </p>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest px-1 block mb-2">
              {language === "en" ? "Role" : "Rol de Usuario"}
            </label>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest">
              <span>{profile?.role === "admin" ? "Administrador" : "Usuario"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <GlowButton type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 text-sm">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {language === "en" ? "Save Changes" : "Guardar Cambios"}
          </GlowButton>
        </div>
      </form>
    </GlassCard>
  );
}
