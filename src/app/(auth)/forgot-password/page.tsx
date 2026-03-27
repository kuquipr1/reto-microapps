"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/`,
    });

    if (error) {
      toast(error.message, "error");
      setLoading(false);
    } else {
      toast(t("forgot.success_toast"), "success");
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(to_bottom_right,var(--color-primary),var(--color-accent-pink))] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-6 text-2xl font-bold text-white">
          M
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">{t("forgot.title")}</h1>
        <p className="text-[var(--color-base-content)] opacity-70 text-sm">
          {t("app.tagline")}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="email"
            placeholder={t("email.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            required
          />

          <GlowButton type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : t("forgot.title")}
          </GlowButton>
        </form>
      ) : (
        <div className="text-center py-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-200">
          {t("forgot.success_toast")}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-[var(--color-base-content)] opacity-70 hover:opacity-100 hover:text-[var(--color-accent-pink)] transition-colors"
        >
          <ArrowLeft size={16} />
          {t("forgot.back")}
        </Link>
      </div>
    </GlassCard>
  );
}
