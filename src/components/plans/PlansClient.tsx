"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function PlansClient({ plans, profile }: { plans: any[], profile: any }) {
  const { language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const NOMBRES = ["Carlos", "Ana", "Luis", "María", "Pedro", "Sofía", "Jorge", "Laura", "Andrés", "Valentina"];
  const APELLIDOS = ["García", "López", "Martínez", "Rodríguez", "Hernández", "Pérez", "González", "Sánchez", "Torres", "Ramírez"];
  
  const [form, setForm] = useState({
    first_name: NOMBRES[Math.floor(Math.random() * NOMBRES.length)],
    last_name: APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)],
    email: `demo_${Math.random().toString(36).substring(2, 7)}@gmail.com`,
  });

  const handleAccessClick = (plan: any) => {
    if (profile?.plan_id === plan.id) {
      alert(language === "en" ? "You already have this plan active" : "Ya tienes este plan activo");
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const submitPayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/webhooks/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "payment.completed",
          customer: {
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name
          },
          plan: selectedPlan.slug,
          source: "self-service",
          transaction_id: `self_${Math.random().toString(36).substring(2, 10)}`,
          amount: parseFloat(selectedPlan.price_monthly),
          currency: "USD"
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");
      
      let msg = language === "en" ? `Plan activated! Welcome to the ${selectedPlan.name_en} plan.` : `¡Plan activado! Bienvenido al plan ${selectedPlan.name_es}.`;
      if (data.is_new_user) msg += `\nPassword: ${data.generated_password}`;
      
      alert(msg);
      closeModal();
      window.location.reload();
      
    } catch (err: any) {
      alert((language === "en" ? "Error: " : "Error: ") + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
        {plans?.map((plan) => {
          const isCurrentPlan = profile?.plan_id === plan.id;
          const items = Array.isArray(plan.items_es) ? plan.items_es : (typeof plan.items_es === 'string' ? JSON.parse(plan.items_es || "[]") : []);
          const apps = plan.plan_apps?.map((pa: any) => pa.micro_apps) || [];

          return (
            <GlassCard 
              key={plan.id}
              className={`p-8 flex flex-col relative transition-all duration-300 ${
                isCurrentPlan 
                  ? "border-[#4F46E5]/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] scale-[1.02]" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  {language === "en" ? "Current Plan" : "Plan Actual"}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{language === "en" ? plan.name_en : plan.name_es}</h3>
                <p className="text-white/60 min-h-[48px]">{language === "en" ? plan.description_en : plan.description_es}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">${plan.price_monthly}</span>
                  <span className="text-white/40">/mo</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 mb-8">
                <ul className="space-y-3">
                  {items.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 size={18} className="text-[#4F46E5] shrink-0 mt-0.5" />
                      <span className="text-sm leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>

                {apps.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-3">
                      {language === "en" ? "Includes these apps:" : "Incluye las siguientes Apps:"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {apps.map((app: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2 py-1">
                          <Sparkles size={12} className="text-[#4F46E5]" />
                          <span className="text-[10px] text-white/80 font-medium whitespace-nowrap">
                            {language === "en" ? app.name_en : app.name_es}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <GlowButton onClick={() => handleAccessClick(plan)} className="w-full justify-center">
                  {isCurrentPlan 
                    ? (language === "en" ? "Manage Apps" : "Ir a mis Apps") 
                    : (language === "en" ? "Instant Access" : "Acceso Instantáneo")}
                </GlowButton>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {isModalOpen && selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-[#050014] border border-[#4F46E5]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold text-center py-1.5 uppercase tracking-wider">
              🧪 DEMO MODE — {language === "en" ? "Payment Simulation" : "Simulación de pago"}
            </div>

            <button onClick={closeModal} className="absolute top-8 right-4 text-white/40 hover:text-white">✕</button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">
                Plan: {language === "en" ? selectedPlan.name_en : selectedPlan.name_es} — ${selectedPlan.price_monthly}
              </h3>
              <p className="text-sm text-white/50 mb-6">{language === "en" ? "Enter your details to complete the demo payment." : "Ingresa tus datos para completar el pago demo."}</p>
              
              <div className="bg-gradient-to-br from-[#4F46E5]/80 to-purple-800 p-5 rounded-xl border border-white/10 mb-6 relative shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-end mb-8 relative z-10">
                  <div className="w-10 h-8 bg-white/20 rounded-md border border-white/30 backdrop-blur-md"></div>
                  <div className="text-white font-black italic tracking-tighter text-lg">STRIPE</div>
                </div>
                <div className="font-mono text-xl tracking-widest text-white mb-2 relative z-10">
                  4242 <span className="text-white/50">4242 4242 4242</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-white/70 uppercase font-mono relative z-10">
                  <div>{form.first_name} {form.last_name}</div>
                  <div>09/28 • CVC 472</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase block mb-1">{language === "en" ? "First Name" : "Nombre"}</label>
                    <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-sm text-white outline-none focus:border-[#4F46E5]/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase block mb-1">{language === "en" ? "Last Name" : "Apellido"}</label>
                    <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-sm text-white outline-none focus:border-[#4F46E5]/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-sm text-white outline-none focus:border-[#4F46E5]/50" />
                </div>
              </div>

              <div className="mt-8">
                <GlowButton onClick={submitPayment} disabled={isSubmitting} className="w-full justify-center">
                  {isSubmitting 
                    ? (language === "en" ? "Processing..." : "Procesando...") 
                    : (language === "en" ? "🔒 Confirm Payment" : "🔒 Confirmar Pago")}
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
