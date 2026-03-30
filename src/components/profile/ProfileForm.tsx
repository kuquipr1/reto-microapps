"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { userService, UserProfile } from "@/lib/services/user";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, Loader2, Camera, Shield, Award } from "lucide-react";

export function ProfileForm() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setAvatar(data.avatar_url || null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast(language === "en" ? "File too large (Max 5MB)" : "Archivo muy grande (Máx 5MB)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setAvatar(dataUrl);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userService.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        avatar_url: avatar,
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
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Left Card: Profile Avatar, Role, Level */}
      <GlassCard className="w-full md:w-80 p-8 flex flex-col items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleImageChange} 
        />

        <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer mb-6 z-10 mt-2">
          <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center text-5xl font-black text-white/50 shadow-xl group-hover:scale-105 transition-transform overflow-hidden" style={{ background: "radial-gradient(circle, rgba(23,17,46,1) 0%, rgba(26,21,48,1) 100%)" }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              formData.firstName?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "E"
            )}
          </div>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black/50 transition-all flex items-center justify-center backdrop-blur-sm">
            <Camera className="text-white" size={24} />
          </div>
          {/* Small camera badge */}
          <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg border-[3px] border-[#0F0A1A] transition-transform group-hover:scale-110">
            <Camera size={16} className="text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white z-10 text-center mb-1">
          {formData.firstName || "Eric"} {formData.lastName || "Collin"}
        </h3>
        <p className="text-sm text-white/50 z-10 mb-8 text-center">{profile?.email || "eccollin@gmail.com"}</p>

        {/* Role & Level Blocks */}
        <div className="w-full space-y-3 z-10">
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-blue-400 opacity-80" />
              <span className="text-xs font-medium text-white/60">
                {language === "en" ? "Role" : "Rol"}
              </span>
            </div>
            <span className="text-xs font-bold text-white/90">
              {profile?.role === "admin" 
                ? (language === "en" ? "Admin" : "Administrador") 
                : (language === "en" ? "Normal User" : "Usuario Normal")}
            </span>
          </div>

          <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3">
              <Award size={16} className="text-orange-400 opacity-80" />
              <span className="text-xs font-medium text-white/60">
                {language === "en" ? "Level" : "Nivel"}
              </span>
            </div>
            <span className="text-xs font-bold text-white/90">
              {language === "en" ? "Level 1" : "Nivel 1"}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Right Card: Form */}
      <GlassCard className="w-full p-8 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <h3 className="text-lg font-bold text-white mb-6 relative z-10 border-b border-white/5 pb-4">
          {language === "en" ? "Personal Information" : "Información Personal"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/80 px-1">
                {language === "en" ? "First Name" : "Nombre"}
              </label>
              <Input
                icon={<User size={16} className="text-white/40" />}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Eric"
                className="bg-black/20 border-white/5 focus:border-[var(--color-primary)]/50 focus:bg-white/5 transition-all text-white/90 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/80 px-1">
                {language === "en" ? "Last Name" : "Apellido"}
              </label>
              <Input
                icon={<User size={16} className="text-white/40" />}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Collin"
                className="bg-black/20 border-white/5 focus:border-[var(--color-primary)]/50 focus:bg-white/5 transition-all text-white/90 h-11"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-white/80 px-1 flex items-center gap-2">
              {language === "en" ? "Email" : "Correo Electrónico"}
              <span className="text-[10px] text-white/30 font-normal">
                {language === "en" ? "(Read-only)" : "(Solo lectura)"}
              </span>
            </label>
            <Input
              icon={<Mail size={16} className="text-white/30" />}
              value={profile?.email || ""}
              disabled
              className="bg-black/40 cursor-not-allowed border-transparent text-white/40 h-11"
            />
          </div>

          <div className="flex justify-end pt-8 mt-auto">
            <GlowButton type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border-0 opacity-90 hover:opacity-100 transition-opacity">
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {language === "en" ? "Save Changes" : "Guardar Cambios"}
            </GlowButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
