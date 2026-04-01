"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Zap, CheckCircle, XCircle, Code, Copy, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface LogItem {
  id: string;
  source: string;
  event_type: string;
  status: string;
  created_at: string;
  raw_payload: any;
  normalized_payload: any;
  user?: { email: string } | null;
}

export function WebhooksClient({ planSlugs, initialLogs }: { planSlugs: string[], initialLogs: LogItem[] }) {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [form, setForm] = useState({
    event: "payment.completed",
    first_name: "",
    last_name: "",
    email: "",
    plan: planSlugs[0] || "",
    source: "simulator",
    transaction_id: "",
    amount: "97.00",
    currency: "USD"
  });
  const [simResult, setSimResult] = useState<any>(null);
  const [simError, setSimError] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const NOMBRES = ["Carlos", "Ana", "Luis", "María", "Pedro", "Sofía", "Jorge", "Laura", "Andrés", "Valentina"];
  const APELLIDOS = ["García", "López", "Martínez", "Rodríguez", "Hernández", "Pérez", "González", "Sánchez", "Torres", "Ramírez"];

  const handleQuickGenerate = () => {
    const randomName = NOMBRES[Math.floor(Math.random() * NOMBRES.length)];
    const randomLast = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
    const randomPlan = planSlugs[Math.floor(Math.random() * planSlugs.length)] || "professional";
    const randomCode = Math.random().toString(36).substring(2, 7);
    
    setForm({
      event: "payment.completed",
      first_name: randomName,
      last_name: randomLast,
      email: `demo_${randomCode}@gmail.com`,
      plan: randomPlan,
      source: "simulator",
      transaction_id: `sim_${Math.random().toString(36).substring(2, 10)}`,
      amount: "97.00",
      currency: "USD"
    });
    setSimResult(null);
    setSimError(null);
  };

  const simulatePayment = async () => {
    try {
      setSimError(null);
      setSimResult(null);
      
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: form.event,
          customer: {
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name
          },
          plan: form.plan,
          source: form.source,
          transaction_id: form.transaction_id,
          amount: parseFloat(form.amount),
          currency: form.currency
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");
      
      setSimResult(data);
      alert(language === "en" ? "Success!" : "¡Éxito!");
      
      // Optionally reload the page to fetch logs (or just prepend dummy data)
      window.location.reload();
      
    } catch (err: any) {
      setSimError(err.message);
      alert((language === "en" ? "Error: " : "Error: ") + err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === "en" ? "Copied!" : "¡Copiado!");
  };

  return (
    <div className="space-y-8">
      {/* 3A: SIMULATOR */}
      <GlassCard className="p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-[#4F46E5]" size={20} />
            {language === "en" ? "Webhook Simulator" : "Simulador de Webhooks"}
          </h2>
          <button 
            onClick={handleQuickGenerate}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 hover:from-yellow-400/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm font-bold transition-all shadow-lg overflow-hidden"
          >
            <Zap size={16} /> Quick Generate
            <div className="absolute inset-0 bg-gradient-to-r from-transparent relative-transparent to-transparent group-hover:-translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">{language === "en" ? "Event Type" : "Tipo de Evento"}</label>
            <select value={form.event} onChange={e => setForm({...form, event: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50">
              <option value="payment.completed">payment.completed</option>
              <option value="subscription.cancelled">subscription.cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">Email</label>
            <input type="text" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">{language === "en" ? "First Name" : "Nombre"}</label>
            <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">{language === "en" ? "Last Name" : "Apellido"}</label>
            <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">Plan</label>
            <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50">
              {planSlugs.map(slug => <option key={slug} value={slug}>{slug}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase mb-1">{language === "en" ? "Source" : "Fuente"}</label>
            <input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-xl text-sm outline-none focus:border-[#4F46E5]/50" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <GlowButton onClick={simulatePayment}>
            🚀 {language === "en" ? "Simulate Payment" : "Simular Pago"}
          </GlowButton>
        </div>

        {/* Dynamic Response Card */}
        {simResult && (
          <div className="mt-4 p-4 border border-green-500/30 bg-green-500/10 rounded-xl">
            <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
              <CheckCircle size={18} /> {language === "en" ? "Payment Processed" : "Pago Procesado"}
            </div>
            <pre className="text-xs text-white/70 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(simResult, null, 2)}</pre>
          </div>
        )}
        {simError && (
          <div className="mt-4 p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center gap-2 text-red-400 font-medium text-sm">
            <XCircle size={18} /> {simError}
          </div>
        )}
      </GlassCard>

      {/* 3B: INTEGRATION GUIDE */}
      <GlassCard className="p-6 border border-[#4F46E5]/20 bg-[#050014]/60">
        <h2 className="text-xl font-bold text-white mb-4">🔗 {language === "en" ? "Payment Processor Integration" : "Integración con Procesadores de Pago"}</h2>
        <p className="text-white/60 text-sm mb-6">
          {language === "en" 
            ? "Any payment processor (Stripe, PayPal, MercadoPago) can send webhooks to this URL. You need to use an automation tool like Make.com, Zapier, or n8n to convert the payload." 
            : "Cualquier procesador (Stripe, PayPal, MercadoPago) puede enviar webhooks a esta URL. Necesitas usar una herramienta como Make.com o Zapier para convertir el payload."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-2">1. Webhook URL</label>
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-3 group">
              <code className="text-sm text-[#4F46E5]">https://your-domain.vercel.app/api/webhooks/payment</code>
              <button onClick={() => copyToClipboard("https://your-domain.vercel.app/api/webhooks/payment")} className="text-white/40 hover:text-white"><Copy size={16} /></button>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-2">2. JSON Payload</label>
            <div className="relative bg-black/40 border border-white/10 rounded-lg p-3">
              <button onClick={() => copyToClipboard(`{\n  "event": "payment.completed",\n  "customer": {"email": "buyer@example.com", "first_name": "Carlos", "last_name": "García"},\n  "plan": "professional",\n  "source": "stripe",\n  "transaction_id": "txn_abc123"\n}`)} className="absolute top-3 right-3 text-white/40 hover:text-white"><Copy size={16} /></button>
              <pre className="text-xs text-teal-400">
{`{
  "event": "payment.completed",
  "customer": {
    "email": "buyer@example.com",
    "first_name": "Carlos",
    "last_name": "García"
  },
  "plan": "professional",
  "source": "stripe",
  "transaction_id": "txn_abc123"
}`}
              </pre>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-white/40 text-xs">
                <tr><th className="p-3">Our Field</th><th className="p-3">Required</th><th className="p-3">Example</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                <tr><td className="p-3 font-mono">event</td><td className="p-3">✅</td><td className="p-3 text-white/50">payment.completed</td></tr>
                <tr><td className="p-3 font-mono">customer.email</td><td className="p-3">✅</td><td className="p-3 text-white/50">user@email.com</td></tr>
                <tr><td className="p-3 font-mono">plan</td><td className="p-3">✅</td><td className="p-3 text-white/50">professional</td></tr>
                <tr><td className="p-3 font-mono">source</td><td className="p-3">✅</td><td className="p-3 text-white/50">stripe</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500/80 text-sm">
            Tus slugs disponibles actualmente son: <strong className="text-yellow-400">{planSlugs.join(", ")}</strong>. El payload debe coincidir con estos estrictamente.
          </div>
        </div>
      </GlassCard>

      {/* 3C: LOGS TABLE */}
      <GlassCard className="border border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Webhook Logs</h2>
        </div>
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-white/40 border-2 border-dashed border-white/5 m-4 rounded-xl">
              {language === "en" ? "No webhook events recorded yet. Use the simulator above to test." : "Aún no hay eventos de webhook. Usa el simulador de arriba para probar."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">State</th>
                  <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Event</th>
                  <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Source</th>
                  <th className="p-4 text-xs tracking-wider font-bold text-white/40 uppercase">Date</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {logs.map(log => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                      <td className="p-4">
                         <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${log.status === 'processed' ? 'bg-green-500/20 text-green-400' : log.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}>
                           {log.status.toUpperCase()}
                         </span>
                      </td>
                      <td className="p-4 text-white">
                        <div className="font-semibold">{log.event_type}</div>
                        <div className="text-xs text-white/40">{log.user?.email || "Unknown User"}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-white/60 bg-white/5 px-2 py-1 rounded text-xs border border-white/10">{log.source}</span>
                      </td>
                      <td className="p-4 text-white/40 text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-white/30 text-right">
                        {expandedLog === log.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr className="bg-black/30">
                        <td colSpan={5} className="p-4 border-t border-white/5">
                          <pre className="text-xs text-[#ec4899] bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/5">
                            {JSON.stringify(log.normalized_payload, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
