"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast(error.message, "error");
      setLoading(false);
    } else {
      toast(t("signup.success_toast"), "success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <GlassCard>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(to_bottom_right,var(--color-primary),var(--color-accent-pink))] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-6 text-2xl font-bold text-white">
          M
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">{t("signup.title")}</h1>
        <p className="text-[var(--color-base-content)] opacity-70 text-sm">
          {t("app.tagline")}
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={t("signup.first_name")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            icon={<User size={20} />}
            required
          />
          <Input
            type="text"
            placeholder={t("signup.last_name")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <Input
          type="email"
          placeholder={t("email.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={20} />}
          required
        />
        
        <Input
          type="password"
          placeholder={t("password.placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={20} />}
          required
        />

        <GlowButton type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : t("signup.title")}
        </GlowButton>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="text-sm text-[var(--color-base-content)] opacity-70 hover:opacity-100 hover:text-[var(--color-accent-pink)] transition-colors"
        >
          {t("signup.has_account")}
        </Link>
      </div>
    </GlassCard>
  );
}
