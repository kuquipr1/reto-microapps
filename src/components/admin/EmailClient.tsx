"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Mail, ShieldCheck, AlertTriangle, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function EmailClient({ initialConfig, adminEmail, adminName }: { initialConfig: any, adminEmail: string, adminName: string }) {
  const { language } = useLanguage();
  
  const [form, setForm] = useState({
    host: initialConfig.host || "",
    port: initialConfig.port || 587,
    username: initialConfig.username || "",
    password: "", // Never auto-fill for security unless they type a new one
    from_email: initialConfig.from_email || "",
    from_name: initialConfig.from_name || ""
  });
  
  const [testRecipient, setTestRecipient] = useState(adminEmail);
  const [isTesting, setIsTesting] = useState(false);
  const [isVerified, setIsVerified] = useState(initialConfig.is_verified || false);
  const [verifiedAt, setVerifiedAt] = useState(initialConfig.verified_at || null);

  const applyProvider = (providerOpts: Partial<typeof form>) => {
    setForm(prev => ({
      ...prev,
      ...providerOpts,
      from_email: prev.from_email || adminEmail,
      from_name: prev.from_name || adminName
    }));
  };

  const handleTestSubmit = async () => {
    setIsTesting(true);
    try {
      const payload = {
        host: form.host,
        port: form.port,
        username: form.username,
        // Send the old password (if it exists) if the user didn't type a new one
        password: form.password || initialConfig.password || "",
        from_email: form.from_email,
        from_name: form.from_name,
        test_recipient: testRecipient
      };

      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${(await (await import('@supabase/supabase-js')).createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!).auth.getSession()).data.session?.access_token}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to send email");
      
      alert((language === "en" ? "Success: " : "Éxito: ") + data.smtp_response);
      
      // Update Verified status locally
      setIsVerified(true);
      setVerifiedAt(new Date().toISOString());
      
      // Keep form intact (clearing password visually ensures they don't leak it on screen)
      setForm(prev => ({ ...prev, password: "" }));
      // Actually we just update initialConfig virtually
      initialConfig.password = payload.password;

    } catch (err: any) {
      alert((language === "en" ? "Error: " : "Error: ") + err.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 5A: Status Banner */}
      {isVerified ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
          <ShieldCheck className="text-green-400" size={24} />
          <div>
            <h3 className="text-green-400 font-bold text-sm">
              {language === "en" ? "SMTP Configured and Verified" : "SMTP Configurado y Verificado"}
            </h3>
            <p className="text-green-500/70 text-xs">
              {language === "en" ? "Last verified: " : "Última verificación: "}
              {verifiedAt ? new Date(verifiedAt).toLocaleString() : "Now"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="text-yellow-400" size={24} />
          <div>
            <h3 className="text-yellow-400 font-bold text-sm">
              {language === "en" ? "SMTP Not Configured" : "SMTP No Configurado"}
            </h3>
            <p className="text-yellow-500/70 text-xs">
              {language === "en" ? "Welcome emails are currently disabled." : "Los emails de bienvenida están desactivados."}
            </p>
          </div>
        </div>
      )}

      {/* 5B: Settings Form */}
      <GlassCard className="p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 border-b border-white/10 pb-4 gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="text-[#4F46E5]" size={20} />
            {language === "en" ? "SMTP Settings" : "Configuración SMTP"}
          </h2>
          
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => applyProvider({host: "smtp.sendgrid.net", port: 587, username: "apikey"})} className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#4F46E5]/25 transition-colors">SendGrid</button>
            <button onClick={() => applyProvider({host: "smtp.gmail.com", port: 587, username: adminEmail})} className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#4F46E5]/25 transition-colors">Gmail SMTP</button>
            <button onClick={() => applyProvider({host: "smtp.mailgun.org", port: 587, username: adminEmail})} className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#4F46E5]/25 transition-colors">Mailgun</button>
            <button onClick={() => applyProvider({host: "email-smtp.us-east-1.amazonaws.com", port: 587, username: adminEmail})} className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5]/15 text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#4F46E5]/25 transition-colors">Amazon SES</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase font-bold mb-1">Host</label>
              <input type="text" value={form.host} onChange={e => {setForm({...form, host: e.target.value}); setIsVerified(false);}} placeholder="smtp.sendgrid.net" className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase font-bold mb-1">Port</label>
              <input type="number" value={form.port} onChange={e => {setForm({...form, port: Number(e.target.value)}); setIsVerified(false);}} placeholder="587" className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase font-bold mb-1">Username</label>
              <input type="text" value={form.username} onChange={e => {setForm({...form, username: e.target.value}); setIsVerified(false);}} placeholder="apikey" className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase font-bold mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => {setForm({...form, password: e.target.value}); setIsVerified(false);}} placeholder={initialConfig.password ? '•••••••• (Saved)' : '••••••••'} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
              <p className="text-[10px] text-white/30 mt-1">
                {language === "en" ? "Leave blank to keep existing password." : "Deja en blanco para conservar la contraseña actual."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-white/5">
          <div>
            <label className="block text-xs text-white/40 uppercase font-bold mb-1">From Email</label>
            <input type="email" value={form.from_email} onChange={e => {setForm({...form, from_email: e.target.value}); setIsVerified(false);}} placeholder="noreply@yourdomain.com" className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase font-bold mb-1">From Name</label>
            <input type="text" value={form.from_name} onChange={e => {setForm({...form, from_name: e.target.value}); setIsVerified(false);}} placeholder="My AI Portal" className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
          </div>
        </div>
      </GlassCard>

      {/* 5C: Test Section */}
      <GlassCard className="p-6 border border-white/10 bg-[#4F46E5]/5">
        <h3 className="text-lg font-bold text-white mb-4">
          {language === "en" ? "Save & Verify" : "Guardar y Verificar"}
        </h3>
        <p className="text-sm text-white/60 mb-6 max-w-2xl">
          {language === "en" ? "To save these settings, you must successfully send a test email. This ensures your portal only uses valid credentials." : "Para guardar esta configuración, debes enviar un email de prueba exitoso. Esto asegura que el portal use solo credenciales válidas."}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-white/40 uppercase font-bold mb-1">
              {language === "en" ? "Test Recipient Email" : "Email Destinatario de Prueba"}
            </label>
            <input type="email" value={testRecipient} onChange={e => setTestRecipient(e.target.value)} className="w-full bg-black/40 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50 transition-colors" />
          </div>
          <GlowButton onClick={handleTestSubmit} disabled={isTesting} className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2">
            <Send size={16} />
            {isTesting ? (language === "en" ? "Testing..." : "Probando...") : (language === "en" ? "Send Test Email" : "Enviar Email de Prueba")}
          </GlowButton>
        </div>
      </GlassCard>
    </div>
  );
}
