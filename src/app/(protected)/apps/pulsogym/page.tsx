"use client";

import { useState } from "react";
import { Activity, ClipboardList, CheckCircle2, Bot, Plus, ArrowRight, ShieldAlert, TrendingUp, Presentation, AlertCircle } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

interface ClassLog {
  id: string;
  time: string;
  className: string;
  instructor: string;
  attendees: number;
  incidents: string;
}

export default function PulsoGymPage() {
  const [activeView, setActiveView] = useState<"staff" | "owner">("owner");
  
  // Initial demo data
  const [logs, setLogs] = useState<ClassLog[]>([
    { id: "1", time: "07:00 AM", className: "Spinning", instructor: "Carlos M.", attendees: 14, incidents: "" },
    { id: "2", time: "09:00 AM", className: "Pilates", instructor: "Laura G.", attendees: 8, incidents: "Miembro quejándose por el aire acondicionado excesivamente frío." },
    { id: "3", time: "06:00 PM", className: "Crossfit", instructor: "Hugo V.", attendees: 22, incidents: "" },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    time: "07:00 PM",
    className: "Yoga",
    instructor: "",
    attendees: "",
    incidents: ""
  });

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instructor || !formData.attendees) return;

    setLogs(prev => [...prev, {
      id: Math.random().toString(),
      time: formData.time,
      className: formData.className,
      instructor: formData.instructor,
      attendees: parseInt(formData.attendees),
      incidents: formData.incidents
    }]);

    setFormData({
      time: "08:00 PM",
      className: "Spinning",
      instructor: "",
      attendees: "",
      incidents: ""
    });
    
    // Switch to owner view after submit
    setActiveView("owner");
    setAiReport(null); // Clear previous report since data changed
  };

  const generateReport = async () => {
    if (logs.length === 0) return;
    setIsGenerating(true);
    setAiReport(null);

    try {
      const res = await fetch("/api/ai/pulsogym/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiReport(data.result);
    } catch (err: any) {
      alert("Error generating report: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <Activity size={32} className="text-emerald-400" />
          PulsoGym
        </h1>
        <p className="text-white/60">
          El reporte diario de tu gimnasio enviado a las 9 PM, sin llamar ni preguntar a nadie.
        </p>
      </div>

      <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
         <button
           onClick={() => setActiveView("staff")}
           className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeView === "staff" ? "bg-emerald-500/20 text-emerald-300" : "text-white/60 hover:text-white"}`}
         >
           <ClipboardList size={18} />
           App Instructores (Registro)
         </button>
         <button
           onClick={() => setActiveView("owner")}
           className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeView === "owner" ? "bg-teal-500/20 text-teal-300" : "text-white/60 hover:text-white"}`}
         >
           <TrendingUp size={18} />
           Vista Dueño (Reporte IA)
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        {/* VIEW 1: STAFF ENTRY FORM */}
        {activeView === "staff" && (
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 lg:col-span-1 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Presentation className="text-emerald-400" size={20} />
                Cierre de Clase
              </h2>
              <p className="text-sm text-white/50 mb-2">
                Los instructores llenan esto en 10 segundos al terminar su turno.
              </p>

              <form onSubmit={submitLog} className="flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70 uppercase">Horario</label>
                      <select name="time" value={formData.time} onChange={handleFormChange} className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                        <option value="06:00 AM">06:00 AM</option>
                        <option value="07:00 AM">07:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/70 uppercase">Clase</label>
                      <select name="className" value={formData.className} onChange={handleFormChange} className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                        <option value="Spinning">Spinning</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Crossfit">Crossfit</option>
                        <option value="Pilates">Pilates</option>
                        <option value="Boxeo">Boxeo</option>
                      </select>
                    </div>
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase">Instructor a Cargo</label>
                    <input name="instructor" value={formData.instructor} onChange={handleFormChange} placeholder="Ej. Mariana T." required className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase">Número de Asistentes</label>
                    <input type="number" name="attendees" value={formData.attendees} onChange={handleFormChange} placeholder="Ej. 12" required className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/70 uppercase flex justify-between">
                       <span>Incidencias (Opcional)</span>
                       <AlertCircle size={14} className="text-white/30" />
                    </label>
                    <textarea name="incidents" value={formData.incidents} onChange={handleFormChange} rows={2} placeholder="Fallas en equipo, quejas, falta de limpieza..." className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none" />
                 </div>

                 <GlowButton type="submit" className="w-full py-4 mt-2 !bg-emerald-600 hover:!bg-emerald-500 !shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2">
                   <CheckCircle2 size={18} /> Registrar Clase
                 </GlowButton>
              </form>
           </div>
        )}

        {/* VIEW 2: OWNER DASHBOARD */}
        {activeView === "owner" && (
           <>
           {/* Column 1: DB Logs Preview */}
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 lg:col-span-1 min-h-[500px] animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-2">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList className="text-teal-400" size={20} /> Base de Datos del Día
                 </h2>
                 <span className="text-xs px-2 py-1 bg-white/10 rounded-lg">{logs.length} Clases</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
                 {logs.map(log => (
                    <div key={log.id} className="p-3 bg-black/30 border border-white/5 rounded-xl flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                          <span className="font-semibold text-[var(--color-accent-blue)]">{log.className}</span>
                          <span className="text-xs text-white/50">{log.time}</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                             <span className="text-sm text-white/80">{log.instructor}</span>
                             {log.incidents && <span className="text-xs text-red-400 mt-1 flex gap-1"><ShieldAlert size={12}/> {log.incidents}</span>}
                          </div>
                          <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-1 rounded font-bold">{log.attendees} Pax</span>
                       </div>
                    </div>
                 ))}
                 {logs.length === 0 && <div className="text-center text-white/40 my-10 italic">No hay clases registradas hoy.</div>}
              </div>

              <GlowButton onClick={generateReport} disabled={isGenerating || logs.length === 0} className="w-full py-4 flex items-center justify-center gap-2 mt-auto shrink-0">
                 {isGenerating ? <Bot size={20} className="animate-spin" /> : <Bot size={20} />}
                 {isGenerating ? "Procesando Datos..." : "Generar Reporte IA (9:00 PM)"}
              </GlowButton>
           </div>
           
           {/* Column 2: Whatsapp Simulation */}
           <div className="bg-[#0b141a] border border-[#202c33] rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden relative lg:col-span-1 animate-in slide-in-from-bottom-8">
              <div className="bg-[#202c33] p-4 flex items-center gap-3 shrink-0">
                 <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Activity size={20} />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-[#e9edef] text-sm">PulsoGym Bot</span>
                    <span className="text-xs text-[#8696a0]">en línea</span>
                 </div>
              </div>
              
              <div className="flex-1 bg-[#0b141a] p-4 overflow-y-auto" style={{backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(11,20,26,0.95)'}}>
                 {!aiReport && !isGenerating && (
                    <div className="mx-auto bg-[#182229] border border-[#202c33] text-[#8696a0] text-xs p-2 rounded-lg text-center max-w-[80%] mt-4 shadow-sm">
                       Los mensajes están cifrados de extremo a extremo con IA. Ejecuta el reporte para ver el resumen ejecutivo en WhatsApp.
                    </div>
                 )}

                 {isGenerating && (
                    <div className="flex max-w-[85%] mt-4 gap-2 mr-auto bg-[#202c33] p-3 rounded-xl rounded-tl-none shadow border border-[#202c33]/50">
                       <span className="text-[#e9edef] text-sm flex items-center gap-2">Escribiendo<span className="flex gap-0.5"><span className="w-1 h-1 bg-[#8696a0] rounded-full animate-bounce"></span><span className="w-1 h-1 bg-[#8696a0] rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span><span className="w-1 h-1 bg-[#8696a0] rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span></span></span>
                    </div>
                 )}

                 {aiReport && (
                    <div className="flex flex-col max-w-[90%] mt-6 gap-2 mr-auto bg-[#202c33] p-4 rounded-xl rounded-tl-none shadow-md border border-[#202c33]/80 animate-in fade-in slide-in-from-left-4 relative">
                       <span className="text-[#8696a0] text-xs font-bold mb-1 -mt-1 flex justify-between">~ PulsoGym 🤖 <span className="font-normal text-[10px]">21:00</span></span>
                       <div className="text-[#e9edef] text-[15px] whitespace-pre-wrap leading-snug">
                          {aiReport}
                       </div>
                    </div>
                 )}
              </div>
           </div>
           </>
        )}
      </div>
    </div>
  );
}
