"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast(t("login.verified"), "success");
    }
    if (searchParams.get("error") === "auth-link-failed") {
      toast(t("login.auth_failed"), "error");
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/dashboard");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [searchParams, router, supabase, toast, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast(error.message, "error");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <GlassCard>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[linear-gradient(to_bottom_right,var(--color-primary),var(--color-accent-pink))] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-6 text-2xl font-bold text-white">
          M
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">{t("app.name")}</h1>
        <p className="text-[var(--color-base-content)] opacity-70 text-sm">
          {t("app.tagline")}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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

        <div className="flex justify-end pt-1">
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--color-accent-blue)] hover:text-white transition-colors"
          >
            {t("login.forgot_password")}
          </Link>
        </div>

        <GlowButton type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : t("login.title")}
        </GlowButton>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/signup"
          className="text-sm text-[var(--color-base-content)] opacity-70 hover:opacity-100 hover:text-[var(--color-accent-pink)] transition-colors"
        >
          {t("login.no_account")}
        </Link>
      </div>
    </GlassCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
