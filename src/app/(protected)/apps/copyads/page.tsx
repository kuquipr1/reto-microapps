"use client";

import { useState } from "react";
import { Loader2, Megaphone, Facebook, Instagram, Search, Copy, Check, Sparkles } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

type Platform = "Facebook" | "Instagram" | "Google";

export default function CopyAdsPage() {
  const [platform, setPlatform] = useState<Platform>("Facebook");
  const [producto, setProducto] = useState("");
  const [oferta, setOferta] = useState("");
  const [publico, setPublico] = useState("");
  const [tono, setTono] = useState("Persuasivo");

  const [isProcessing, setIsProcessing] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const processForm = async () => {
    if (!producto || !oferta || !publico) return;
    
    setIsProcessing(true);
    setAdData(null);
    
    try {
      const res = await fetch("/api/ai/copyads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, producto, oferta, publico, tono }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar el anuncio.");
      
      setAdData(data.result);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!adData) return;
    let txt = "";
    
    if (adData.titulos) {
      // Google Format
      txt += "Titulos:\n" + adData.titulos.map((t: string) => `- ${t}`).join("\n") + "\n\n";
      txt += "Descripciones:\n" + adData.descripciones.map((d: string) => `- ${d}`).join("\n");
    } else {
      // Facebook / Instagram Format
      if(adData.gancho) txt += `[Gancho]\n${adData.gancho}\n\n`;
      if(adData.cuerpo) txt += `[Cuerpo]\n${adData.cuerpo}\n\n`;
      if(adData.cta) txt += `[CTA]\n${adData.cta}\n\n`;
      if(adData.hashtags) txt += `[Hashtags]\n${adData.hashtags}`;
    }

    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
          <Megaphone size={32} className="text-orange-400 fill-orange-400/20" />
          CopyAds AI
        </h1>
        <p className="text-white/60">
          Generador de copys persuasivos para anuncios en Facebook, Instagram y Google Ads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
        {/* Left Column: Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 lg:col-span-5 h-fit shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Sparkles size={18} className="text-orange-400" />
            Configuración del Anuncio
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">Plataforma</label>
            <div className="grid grid-cols-3 gap-2">
               <button 
                  onClick={() => setPlatform("Facebook")}
                  className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${platform === "Facebook" ? "bg-blue-600/20 border-blue-500 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/20 border-white/5 text-white/50 hover:bg-white/5"}`}
               >
                 <Facebook size={20} /> <span className="text-[10px] uppercase tracking-wider">Facebook</span>
               </button>
               <button 
                  onClick={() => setPlatform("Instagram")}
                  className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${platform === "Instagram" ? "bg-pink-600/20 border-pink-500 text-pink-400 font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "bg-black/20 border-white/5 text-white/50 hover:bg-white/5"}`}
               >
                 <Instagram size={20} /> <span className="text-[10px] uppercase tracking-wider">Instagram</span>
               </button>
               <button 
                  onClick={() => setPlatform("Google")}
                  className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${platform === "Google" ? "bg-green-600/20 border-green-500 text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-black/20 border-white/5 text-white/50 hover:bg-white/5"}`}
               >
                 <Search size={20} /> <span className="text-[10px] uppercase tracking-wider">Google</span>
               </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
             <label className="text-xs font-semibold text-white/70">Producto o Servicio</label>
             <input type="text" value={producto} onChange={e => setProducto(e.target.value)} placeholder="Ej. Curso de Marketing Digital" className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500/50 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-white/70">Oferta o Promoción Principal</label>
             <input type="text" value={oferta} onChange={e => setOferta(e.target.value)} placeholder="Ej. 50% de descuento solo hoy" className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500/50 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-white/70">Público Objetivo</label>
             <input type="text" value={publico} onChange={e => setPublico(e.target.value)} placeholder="Ej. Emprendedores de 25-45 años" className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500/50 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-white/70">Tono del Mensaje</label>
             <select value={tono} onChange={e => setTono(e.target.value)} className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500/50 outline-none">
                <option value="Persuasivo">Persuasivo y Directo</option>
                <option value="Urgencia">Urgente (Scarcity)</option>
                <option value="Emocional">Emocional e Inspirador</option>
                <option value="Profesional">Profesional y Corporativo</option>
                <option value="Gracioso">Divertido e Informal</option>
             </select>
          </div>

          <GlowButton 
            onClick={processForm} 
            disabled={!producto || !oferta || !publico || isProcessing} 
            className="w-full py-4 mt-4 !bg-gradient-to-r !from-orange-600 !to-pink-600 hover:!from-orange-500 hover:!to-pink-500 !shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 text-white font-bold"
          >
            {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Escribiendo Copy...</> : <><Sparkles size={18} /> Generar Anuncio</>}
          </GlowButton>
        </div>

        {/* Right Column: Output Preview */}
        <div className="bg-[#eef2f6] border border-white/10 rounded-2xl flex flex-col lg:col-span-7 h-[680px] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* Header Preview */}
          <div className="bg-[#1e293b] p-3 text-white flex justify-between items-center shadow-md z-10 shrink-0 border-b border-white/5">
             <div className="flex items-center gap-2 text-sm font-semibold text-orange-50">
                {platform === "Facebook" && <Facebook size={16} className="text-blue-400" />}
                {platform === "Instagram" && <Instagram size={16} className="text-pink-400" />}
                {platform === "Google" && <Search size={16} className="text-green-400" />}
                Vista Previa del Copy
             </div>
             
             {adData && (
                <button onClick={handleCopy} className="px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold transition-all bg-white/20 hover:bg-white/30 text-white">
                  {copied ? <><Check size={14} className="text-green-400"/> Copiado</> : <><Copy size={14} /> Copiar Texto</>}
                </button>
             )}
          </div>

          {/* Content Preview */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 relative flex justify-center bg-[#f1f5f9]">
             {!adData && !isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-100 p-8 text-center gap-4">
                   <Megaphone size={64} className="opacity-20 text-slate-500" />
                   <p className="max-w-xs text-sm">Completa el formulario y genera un ad copy persuasivo al instante.</p>
                </div>
             )}

             {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f1f5f9]/80 backdrop-blur-[2px] z-20">
                   <div className="flex flex-col items-center gap-4 text-orange-600">
                     <Loader2 size={40} className="animate-spin" />
                     <span className="font-bold text-sm tracking-widest uppercase text-slate-800">Aplicando PNL y Persuasión...</span>
                   </div>
                </div>
             )}

             {adData && (
                <div className="w-full max-w-[500px] flex flex-col gap-6 animate-in zoom-in-95 duration-500 pb-10">
                   
                   {/* Facebook / Instagram Render */}
                   {(platform === "Facebook" || platform === "Instagram") && (
                      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col text-[#1c1e21] font-[Segoe UI, system-ui, sans-serif]">
                         {/* Mock Header */}
                         <div className="p-3 flex items-center gap-3 border-b border-slate-100">
                           <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                           <div className="flex flex-col">
                              <span className="font-bold text-[14px]">Tu Marca</span>
                              <span className="text-[12px] text-slate-500">Publicidad</span>
                           </div>
                         </div>
                         
                         {/* Copy Content */}
                         <div className="p-4 text-[15px] leading-relaxed whitespace-pre-wrap">
                            {adData.gancho && <p className="font-bold mb-3">{adData.gancho}</p>}
                            {adData.cuerpo && <p className="mb-4">{adData.cuerpo}</p>}
                            {adData.cta && <p className="font-semibold">{adData.cta}</p>}
                            {adData.hashtags && <p className="text-blue-600 mt-3 text-sm">{adData.hashtags}</p>}
                         </div>

                         {/* Mock Image Area */}
                         <div className="w-full h-48 bg-slate-100 border-y border-slate-100 flex items-center justify-center text-slate-400 text-sm">
                           [Espacio Visual]
                         </div>

                         {/* Mock CTA Footer */}
                         <div className="p-3 bg-slate-50 flex justify-between items-center">
                           <div className="flex flex-col">
                              <span className="text-[12px] text-slate-500 uppercase tracking-widest">tumarca.com</span>
                              <span className="font-bold text-[15px]">Haz clic para más info</span>
                           </div>
                           <button className="bg-slate-200 px-4 py-1.5 rounded font-semibold text-[14px]">Más información</button>
                         </div>
                      </div>
                   )}

                   {/* Google Ads Render */}
                   {platform === "Google" && (
                      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col gap-5 text-[#202124] font-arial">
                         <div className="flex items-center gap-2 text-[14px] text-slate-600 mb-2">
                           <b className="text-black">Anuncio</b> · www.tumarca.com
                         </div>
                         
                         <div className="flex flex-col gap-1">
                            {adData.titulos && adData.titulos.length > 0 && (
                               <div className="text-[20px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight mb-2">
                                 {adData.titulos.join(" | ")}
                               </div>
                            )}
                            
                            {adData.descripciones && adData.descripciones.length > 0 && (
                               <div className="text-[14px] text-[#4d5156] leading-snug break-words">
                                 {adData.descripciones.join(" ")}
                               </div>
                            )}
                         </div>

                         <div className="mt-6 border-t border-slate-100 pt-4">
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Títulos Generados:</h4>
                           <ul className="text-sm space-y-1 text-slate-700">
                             {adData.titulos?.map((t: string, i: number) => (
                               <li key={i} className="flex items-center gap-2">
                                 <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">{t.length}</span>
                                 {t}
                               </li>
                             ))}
                           </ul>
                         </div>
                         
                         <div className="mt-2 text-xs text-slate-400">
                           <p>Nota: Los títulos de Google Search ideales tienen máximo 30 caracteres, las descripciones 90.</p>
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
