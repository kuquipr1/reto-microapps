"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Send, Save, CheckCircle2, Bot, User, RefreshCcw, BellRing, Mail, Check, Star } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

interface Lead {
  id: string;
  name: string;
  objective: string;
  plan: string;
  rating: string;
  date: Date;
}

export default function NightLeadPage() {
  const [formData, setFormData] = useState({
    name: "PowerGym Guadalajara",
    plans: "Plan Básico ($400 MXN), Plan Pro (Clases Grupales) ($650 MXN), Anualidad ($4000 MXN)",
    humanHours: "Lunes a viernes 6am-9pm, sábado 7am-2pm",
    emailNotify: "admin@powergym.com",
  });

  const [activeTab, setActiveTab] = useState<"chat" | "inbox">("chat");
  const [isSaved, setIsSaved] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Carlos M.", objective: "Ganar masa muscular", plan: "Plan Pro", rating: "caliente", date: new Date(Date.now() - 3600000 * 8) },
    { id: "2", name: "Ana Torres", objective: "Bajar de peso", plan: "Plan Básico", rating: "tibio", date: new Date(Date.now() - 3600000 * 5) }
  ]);

  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: `¡Hola! Ahora mismo nuestro gimnasio está cerrado, pero soy el asistente virtual nocturno. ¿Buscas informes sobre planes y precios? 🌙` }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setMessages([
      { role: "assistant", content: `¡Scripts de atención nocturna actualizados para ${formData.name}! Pruébame fingiendo ser un cliente interesado.` }
    ]);
    setActiveTab("chat");
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
      const res = await fetch("/api/ai/nightlead/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
          config: formData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "assistant", content: data.result }]);

      if (data.lead_captured) {
         // Create the new lead
         const newLead = { 
           id: Math.random().toString(), 
           ...data.lead_captured, 
           date: new Date() 
         };
         setLeads(prev => [newLead, ...prev]);
         // Automatically switch to Inbox after 3 seconds to show the magic
         setTimeout(() => {
            setActiveTab("inbox");
         }, 3500);
      }

    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error en el servidor lunar. 🌙" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
          <Moon size={32} className="text-purple-400" />
          NightLead Gym
        </h1>
        <p className="text-white/60">
          Captura y califica leads mientras tu gimnasio duerme. No pierdas más ventas nocturnas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Left Col: Setup form */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
           <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white/90">
              Configuración Nocturna
            </h2>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">Gimnasio & Ciudad</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
             </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">Planes Activos</label>
                <textarea
                  name="plans"
                  value={formData.plans}
                  onChange={handleChange}
                  rows={2}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                />
             </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">Horario Humano</label>
                <input
                  name="humanHours"
                  value={formData.humanHours}
                  onChange={handleChange}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
             </div>
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70 text-[var(--color-accent-pink)] flex gap-2"><Mail size={16}/> Email Destino para Resúmenes</label>
                <input
                  name="emailNotify"
                  value={formData.emailNotify}
                  onChange={handleChange}
                  className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
             </div>
             <GlowButton onClick={handleSave} className="w-full py-3 mt-4 !bg-purple-600 hover:!bg-purple-500 !shadow-[0_0_15px_rgba(168,85,247,0.5)]">
               {isSaved ? "Activado / Guardado" : "Guardar & Activar Turno Nocturno"}
             </GlowButton>
          </div>
        </div>

        {/* Right Col: Simulation and Inbox */}
        <div className="xl:col-span-3 bg-[#080514] border border-white/10 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden relative">
           
           {/* Tabs */}
           <div className="flex bg-white/5 border-b border-white/10 shrink-0 p-2 gap-2">
             <button
               onClick={() => setActiveTab("chat")}
               className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "chat" ? "bg-purple-500/20 text-purple-300" : "text-white/50 hover:bg-white/5"}`}
             >
               <Bot size={18} />
               Simular Chat Cliente
             </button>
             <button
               onClick={() => setActiveTab("inbox")}
               className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "inbox" ? "bg-pink-500/20 text-pink-300" : "text-white/50 hover:bg-white/5"}`}
             >
               <BellRing size={18} />
               Bandeja de Leads Mañana
               {leads.length > 2 && <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center ml-1">{leads.length}</span>}
             </button>
           </div>

           {/* Tab Content */}
           <div className="flex-1 overflow-hidden relative">
             <div>
               
               {activeTab === "chat" && (
                 <div 
                   className="absolute inset-0 flex flex-col bg-[#050510]"
                 >
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                       <div className="text-center text-xs text-white/30 uppercase tracking-widest my-2">Simulador: 10:45 PM</div>
                       {messages.map((m, i) => (
                          <div key={i} className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/10 text-white/50"}`}>
                              {m.role === "user" ? <User size={14} /> : <Moon size={14} />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                              m.role === "user" 
                                ? "bg-purple-600 text-white rounded-tr-none shadow-lg" 
                                : "bg-white/10 text-white rounded-tl-none border border-white/5 shadow-md"
                            }`}>
                              {m.content}
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex gap-3 max-w-[85%] self-start">
                             <div className="w-8 h-8 rounded-full bg-white/10 text-white/50 flex items-center justify-center shrink-0"><Moon size={14} /></div>
                             <div className="p-4 rounded-2xl bg-white/10 text-white flex gap-1 h-10 items-center rounded-tl-none"><span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></span>...</div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={sendChatMessage} className="p-3 bg-black/40 border-t border-white/10 flex gap-2 shrink-0">
                      <input 
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Ej. Quiero saber sus planes, mi meta es bajar de peso..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm white focus:border-purple-500/50"
                        disabled={isTyping}
                      />
                      <button type="submit" disabled={isTyping || !inputVal.trim()} className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl disabled:opacity-50"><Send size={18} /></button>
                    </form>
                 </div>
               )}

               {activeTab === "inbox" && (
                 <div 
                   className="absolute inset-0 p-6 flex flex-col overflow-y-auto bg-gradient-to-br from-[#080514] to-[#1a103c]/20"
                 >
                    <div className="flex justify-between items-end mb-6">
                      <div>
                         <h3 className="text-2xl font-bold flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400/20" size={24}/> Nuevos Leads Capturados</h3>
                         <p className="text-sm text-white/50">Recogidos automáticamente mientras tú dormías.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       {leads.map((lead, idx) => (
                         <div 
                           key={lead.id} 
                           className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-white/10 transition-colors"
                         >
                           <div className="flex flex-col gap-1">
                              <h4 className="font-bold text-lg">{lead.name}</h4>
                              <p className="text-sm text-white/60 flex items-center gap-2">
                                Objetivo: <span className="text-white/90">{lead.objective}</span>
                              </p>
                              <p className="text-sm text-white/60 flex items-center gap-2">
                                Plan Interés: <span className="text-[var(--color-accent-blue)]">{lead.plan}</span>
                              </p>
                           </div>
                           <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                              <div className="text-xs text-white/40">{lead.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              <div className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                lead.rating === "caliente" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
                                lead.rating === "tibio" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : 
                                "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}>
                                Tracker: {lead.rating}
                              </div>
                              <button className="text-xs text-purple-400 hover:text-purple-300 font-semibold mt-1">Llamar Ahora</button>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
