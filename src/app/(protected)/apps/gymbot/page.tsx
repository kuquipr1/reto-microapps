"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Save, Code, Copy, Check, Send, Bot, User, RefreshCcw } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function GymBotPage() {
  const [formData, setFormData] = useState({
    name: "FitZone Polanco",
    plans: "Mensual $599 MXN\nTrimestral $1,599 MXN\nAnual $5,500 MXN",
    schedule: "Lunes a Viernes: 6:00 AM - 10:00 PM\nSábados: 7:00 AM - 2:00 PM\nDomingos: Cerrado\nClases de Spinning: Lunes, Miércoles y Viernes 7:00 AM y 7:00 PM",
    policies: "Cancelación avisando con 15 días de anticipación. Congelamiento de membresías hasta 1 mes por año. 1 día de visita gratis por mes para invitados.",
    faqs: "P: ¿Tienen estacionamiento?\nR: Sí, 2 horas gratis sellando el boleto en recepción.",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const embedCode = `<script src="https://microapps.portal/widget/gymbot.js" data-gym-id="fit_zone_polanco_xyz123" async></script>`;

  // Chat preview state
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: `¡Hola! Soy el asistente virtual de ${formData.name}. ¿En qué te puedo ayudar hoy? 💪` }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // In a real app we would save to Supabase here
    setIsSaved(true);
    setMessages([
      { role: "assistant", content: `¡Base de conocimiento actualizada! Pregúntame sobre ${formData.name}.` }
    ]);
  };

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sendChatMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userMsg = { role: "user", content: inputVal };
    const chatHistory = [...messages, userMsg];
    setMessages(chatHistory);
    setInputVal("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/gymbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          knowledgeBase: formData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "assistant", content: data.result }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "Lo siento, hubo un error de conexión con la recepción virtual. Intenta de nuevo. 😞" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
          <Bot size={32} className="text-blue-400" />
          GymBot FAQ
        </h1>
        <p className="text-white/60">
          Tu recepcionista virtual. Configura el conocimiento de tu gimnasio y obtén un chatbot listo para responder 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Column: Configuration Form (3 cols width) */}
        <div className="xl:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white/90">
              <Code size={20} className="text-[var(--color-primary)]" />
              Base de Conocimiento
            </h2>
            <GlowButton onClick={handleSave} className="py-2 px-4 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]">
              <Save size={16} className="mr-2" />
              {isSaved ? "Guardado" : "Guardar & Entrenar"}
            </GlowButton>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">Nombre del Gimnasio</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
                placeholder="Ej. Muscle Factory"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">Planes y Precios</label>
              <textarea
                name="plans"
                value={formData.plans}
                onChange={handleChange}
                rows={3}
                className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors resize-y"
                placeholder="Ingresa aquí los planes (Mensual, Trimestral, Anual), promociones activas..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">Horarios de Apertura y Clases</label>
                <textarea
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  rows={4}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors resize-y"
                  placeholder="Ej. Lunes a viernes 6am a 10pm..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">Políticas (Cancelaciones, Invitados)</label>
                <textarea
                  name="policies"
                  value={formData.policies}
                  onChange={handleChange}
                  rows={4}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors resize-y"
                  placeholder="Detalles sobre política de cancelaciones, congelamientos..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">Preguntas Frecuentes Extra (Opcional)</label>
              <textarea
                name="faqs"
                value={formData.faqs}
                onChange={handleChange}
                rows={3}
                className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors resize-y"
                placeholder="Preguntas que siempre hacen, ej. Estacionamiento, regaderas..."
              />
            </div>
          </div>
          
          <div className="mt-2 p-4 bg-black/40 border border-white/5 rounded-xl">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/50 uppercase">Widget de Instalación</span>
                <button onClick={copyEmbed} className="text-[var(--color-primary)] flex items-center gap-1 text-xs hover:text-white transition-colors">
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? "Copiado" : "Copiar Código"}
                </button>
             </div>
             <code className="text-xs text-white/60 font-mono break-all line-clamp-2">
                {embedCode}
             </code>
          </div>
        </div>

        {/* Right Column: Chat Preview (2 cols width) */}
        <div className="xl:col-span-2 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-[600px] shadow-2xl relative">
          
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 shrink-0 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Bot size={20} className="text-blue-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white leading-tight">{formData.name} Bot</span>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  En línea (Preview)
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                setMessages([{ role: "assistant", content: `¡Hola! Soy el asistente virtual de ${formData.name}. ¿En qué te puedo ayudar hoy? 💪` }]);
              }}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reiniciar chat"
            >
              <RefreshCcw size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#050510] relative">
            {!isSaved && (
              <div className="absolute top-4 left-4 right-4 bg-orange-500/20 text-orange-200 border border-orange-500/30 p-2 rounded-lg text-xs text-center backdrop-blur-sm z-10">
                Guarda los cambios para que el bot actualice su conocimiento.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" 
                    ? "bg-[var(--color-primary)] text-[#0A0520] font-medium rounded-tr-none shadow-lg" 
                    : "bg-white/10 text-white rounded-tl-none border border-white/5 shadow-md"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-white/10 text-white rounded-tl-none border border-white/5 w-16 h-10 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></span>
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></span>
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendChatMessage} className="p-3 bg-black/40 border-t border-white/10 flex gap-2 shrink-0">
            <input 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Escribe una pregunta para probar..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-primary)]/50 transition-all placeholder:text-white/30 disabled:opacity-50"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputVal.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
