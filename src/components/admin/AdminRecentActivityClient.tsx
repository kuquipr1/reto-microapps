"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { UserPlus, DollarSign, Bot, Clock } from "lucide-react";

export function AdminRecentActivityClient({ activities }: { activities: any[] }) {
  const { language } = useLanguage();

  const getRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto', style: 'short' });
    const elapsed = new Date(dateString).getTime() - new Date().getTime();
    
    const div = [
      { amount: 60, name: 'second' },
      { amount: 60, name: 'minute' },
      { amount: 24, name: 'hour' },
      { amount: 7, name: 'day' },
      { amount: 4.34524, name: 'week' },
      { amount: 12, name: 'month' },
      { amount: Number.POSITIVE_INFINITY, name: 'year' }
    ];

    let amount = Math.abs(elapsed) / 1000;
    let name = 'second';
    for (let i = 0; i < div.length; i++) {
        if (amount < div[i].amount) {
            name = div[i].name;
            break;
        }
        amount /= div[i].amount;
    }
    
    return rtf.format(-Math.round(amount), name as Intl.RelativeTimeFormatUnit);
  };

  return (
    <GlassCard className="p-6 overflow-hidden border border-white/10 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-[var(--color-primary)]" size={24} />
        <h2 className="text-xl font-bold text-white">
          {language === "en" ? "Recent Activity" : "Actividad Reciente"}
        </h2>
      </div>

      {activities.length === 0 ? (
        <p className="text-white/40 text-sm py-4">
          {language === "en" ? "No recent activity found." : "No se encontró actividad reciente."}
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              {act.type === "user" && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <UserPlus size={18} />
                </div>
              )}
              {act.type === "payment" && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                  <DollarSign size={18} />
                </div>
              )}
              {act.type === "execution" && (
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Bot size={18} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90">
                  {act.type === "user" && (
                    <>
                      <span className="font-bold">🆕 {act.name}</span> {language === "en" ? "registered" : "se registró"}
                    </>
                  )}
                  {act.type === "payment" && (
                    <>
                      <span className="font-bold">💰 {language === "en" ? "Payment of" : "Pago de"} ${act.amount ? act.amount.toFixed(2) : "0.00"}</span> {language === "en" ? "received from" : "recibido de"} <span className="text-white/70">{act.name}</span>
                    </>
                  )}
                  {act.type === "execution" && (
                    <>
                      <span className="font-bold">🤖 {act.name}</span> {language === "en" ? "used" : "usó"} <span className="text-[var(--color-primary)]">{language === "en" ? act.appNameEn : act.appNameEs}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {getRelativeTime(act.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
