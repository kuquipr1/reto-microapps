"use client";

import { useState } from "react";
import { Loader2, Calendar, FileDown, Copy, Check, Sparkles, Clock, Target, Hash } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

interface CalendarDay {
  dia: number;
  tipo: string;
  tema: string;
  gancho: string;
  horario: string;
  objetivo: string;
}

export default function ContentFlowPage() {
  const [nicho, setNicho] = useState("");
  const [publico, setPublico] = useState("");
  const [tono, setTono] = useState("");
  const [pilares, setPilares] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarDay[] | null>(null);
  const [copied, setCopied] = useState(false);

  const processForm = async () => {
    if (!nicho || !publico || !tono || !pilares) return;
    
    setIsProcessing(true);
    setCalendarData(null);
    
    try {
      const res = await fetch("/api/ai/contentflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho, publico, tono, pilares }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar el calendario.");
      
      setCalendarData(data.result);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!calendarData) return;
    const txt = calendarData.map(d => `Día ${d.dia} - ${d.tipo}\nTema: ${d.tema}\nGancho: ${d.gancho}\nHorario: ${d.horario}\nObjetivo: ${d.objetivo}`).join('\n\n');
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    if (!calendarData) return;
    const headers = "Día,Tipo,Tema,Gancho,Horario,Objetivo\n";
    const values = calendarData.map(d => `"${d.dia}","${d.tipo}","${d.tema}","${d.gancho}","${d.horario}","${d.objetivo}"`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + values;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "content_calendar_30_days.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
          <Calendar />
          ContentFlow AI 📅
        </h1>
        <p className="text-white/60 max-w-2xl">
          Genera un calendario de contenidos estratégico de 30 días en Facebook, optimizado para pequeñas Agencias de Marketing Digital, en segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 lg:col-span-4 h-max">
          <h3 className="font-medium text-white/90 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            Configuración Estratégica
          </h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70 ml-1">Nicho / Sector del Cliente</label>
            <input 
              type="text" 
              value={nicho} 
              onChange={e => setNicho(e.target.value)} 
              placeholder="Ej. Clínica Dental, Inmobiliaria..."
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70 ml-1">Público Objetivo</label>
            <input 
              type="text" 
              value={publico} 
              onChange={e => setPublico(e.target.value)} 
              placeholder="Ej. Madres de 25-40 años..."
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70 ml-1">Tono de Voz</label>
            <input 
              type="text" 
              value={tono} 
              onChange={e => setTono(e.target.value)} 
              placeholder="Ej. Profesional, Divertido, Cercano..."
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-white/70 ml-1">Pilares de Contenido</label>
            <input 
              type="text" 
              value={pilares} 
              onChange={e => setPilares(e.target.value)} 
              placeholder="Ej. Educativo, Testimonios, Promocional..."
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="mt-2">
            <GlowButton 
              onClick={processForm} 
              disabled={!nicho || !publico || !tono || !pilares || isProcessing}
              className="w-full py-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generando 30 Días...
                </>
              ) : (
                <>Generar Calendario</>
              )}
            </GlowButton>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden lg:col-span-8 min-h-[500px]">
           <div className="p-4 border-b border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-medium text-white/90 flex items-center gap-2">
                <Calendar size={18} className="text-blue-400" />
                Vistas de Resultados (30 Días)
              </h3>
              
              {calendarData && (
                <div className="flex gap-2">
                   <button onClick={handleCopy} className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg flex items-center gap-2 text-xs transition-colors">
                     {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                     <span className="hidden sm:inline">Texto</span>
                   </button>
                   <button onClick={exportCSV} className="p-2 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-lg flex items-center gap-2 text-xs transition-colors">
                     <FileDown size={14} />
                     <span className="hidden sm:inline">Exportar CSV</span>
                   </button>
                </div>
              )}
           </div>
           
           <div className="p-6 flex-1 flex flex-col items-center relative overflow-y-auto w-full h-[600px] lg:h-full">
               {!calendarData && !isProcessing && (
                 <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40 opacity-100 transition-opacity">
                   <Calendar size={48} className="opacity-50" />
                   <p className="max-w-xs text-sm text-center">Completa la estrategia y haz clic en generar para obtener 30 días de contenido para Facebook.</p>
                 </div>
               )}

               {isProcessing && (
                 <div className="flex flex-col items-center justify-center h-full gap-4 text-purple-400 transition-opacity">
                   <div className="w-16 h-16 rounded-full border-4 border-purple-400/20 border-t-purple-400 animate-spin" />
                   <p className="text-sm font-medium animate-pulse text-white/80">El Social Media Manager IA está planificando...</p>
                 </div>
               )}

               {calendarData && !isProcessing && (
                  <div className="w-full flex flex-col gap-4">
                    {calendarData.map((dia) => (
                      <div key={dia.dia} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                          <span className="text-[10px] text-white/50 uppercase tracking-wider">Día</span>
                          <span className="text-xl font-bold text-white">{dia.dia}</span>
                        </div>
                        <div className="flex flex-col gap-2 w-full min-w-0">
                          <div className="flex flex-wrap items-center gap-2 justify-between">
                            <h4 className="font-semibold text-lg text-white/90 truncate mr-2">{dia.tema}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shrink-0">
                              {dia.tipo}
                            </span>
                          </div>
                          
                          <p className="text-sm text-white/70 italic border-l-2 border-purple-400/50 pl-3">"{dia.gancho}"</p>
                          
                          <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <Clock size={12} className="text-white/40" />
                              <span>{dia.horario}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <Target size={12} className="text-white/40" />
                              <span>{dia.objetivo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
}
