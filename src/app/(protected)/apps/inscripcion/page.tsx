"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2, FileText, Zap, Printer, Mail, Check } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function InscripcionTotalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    plan: "Mensual",
    price: "$599 MXN",
    sendEmail: false,
    emailAddress: ""
  });

  const [services, setServices] = useState<string[]>(["Clases Grupales", "Área de pesas"]);
  const SERVICES_LIST = ["Clases Grupales", "Área de pesas", "Alberca", "Regaderas / Casillero"];

  const [step, setStep] = useState<"idle" | "reading" | "generating" | "done">("idle");
  const [extractedData, setExtractedData] = useState<any>(null);
  const [contractHtml, setContractHtml] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageBase64(ev.target?.result as string);
        setStep("idle");
        setContractHtml(null);
        setExtractedData(null);
      };
      reader.readAsDataURL(selected);
    }
  };

  const toggleService = (service: string) => {
    setServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  const processFusion = async () => {
    if (!imageBase64) return;
    
    try {
      // PASO 1: Visión
      setStep("reading");
      const visionRes = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          fields: ["nombre", "teléfono", "email", "fecha_de_nacimiento", "condición_medica", "objetivo"],
        }),
      });
      const visionData = await visionRes.json();
      if (!visionRes.ok) throw new Error(visionData.error);
      
      setExtractedData(visionData.result);

      // PASO 2: Contrato
      setStep("generating");
      const memberName = visionData.result.nombre || visionData.result.Nombre || "Cliente";
      const specialClauses = `Condición Médica: ${visionData.result.condición_medica || 'Ninguna'}. Objetivo Principal: ${visionData.result.objetivo || 'Recreativo'}.`;

      const contractRes = await fetch("/api/ai/contratofit/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          gymName: "FitZone Master",
          memberName: memberName,
          plan: formData.plan,
          price: formData.price,
          startDate: new Date().toISOString().split('T')[0],
          services: services,
          specialClauses: specialClauses
        })
      });
      const contractData = await contractRes.json();
      if (!contractRes.ok) throw new Error(contractData.error);

      // Parse markdown bold and headers
      let parsedHTML = contractData.result
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 border-b border-black/10 pb-1">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-4 mb-4 text-center text-[#2563EB]">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n- /g, '<br/>• ')
        .replace(/\n/g, '<br/>');

      setContractHtml(parsedHTML);
      setStep("done");
      
    } catch (error: any) {
      alert("Error en la Fusión Mágica: " + error.message);
      setStep("idle");
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;
    const content = printRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Contrato Fusionado</title>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #111; line-height: 1.6; font-size: 14px; }
            h1 { text-align: center; text-transform: uppercase; font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 25px; }
            h2 { font-size: 16px; margin-top: 30px; text-transform: uppercase; background: #f4f4f4; padding: 5px; }
            h3 { font-size: 14px; margin-top: 20px; }
            p { margin-bottom: 10px; text-align: justify; }
            .signatures { display: flex; justify-content: space-around; margin-top: 80px; }
            .sign-box { width: 40%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-weight: bold; }
            @media print { margin: 0; }
          </style>
        </head>
        <body>
          \n${content}
          <div class="signatures">
             <div class="sign-box">Por El Gimnasio</div>
             <div class="sign-box">${extractedData?.nombre || extractedData?.Nombre || 'Firma del Titular'}<br/>(LA PARTE CONTRATANTE)</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent flex items-center gap-3">
          <Zap size={32} className="text-yellow-400 fill-yellow-400/20" />
          InscripciónTotal
        </h1>
        <p className="text-white/60">
          La Fusión Épica. De la foto de la ficha al contrato en PDF en menos de 45 segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        
        {/* Left Column: Input Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative h-fit">
          <div className="flex flex-col gap-1">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
               Foto de la Ficha en Papel
             </h2>
             <p className="text-xs text-white/50 mb-2">Sube la ficha médica o de inscripción escrita a mano para que la IA la lea mágicamente.</p>
             <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-white/20 bg-black/20 hover:bg-black/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
             >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
              {imageBase64 ? (
                <div className="w-full h-full p-2 relative group rounded-lg overflow-hidden">
                   <img src={imageBase64} className="w-full h-full object-cover rounded opacity-80" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="font-semibold text-sm">Cambiar Imagen</span>
                   </div>
                </div>
              ) : (
                <>
                  <UploadCloud size={28} className="text-yellow-400" />
                  <span className="text-sm font-medium">Click para subir foto/escaneo</span>
                </>
              )}
             </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-5">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
               Confirma su Paquete
             </h2>
             <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase">Plan</label>
                  <select name="plan" value={formData.plan} onChange={handleChange} className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500/50">
                    <option value="Mensual">Mensual</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase">Precio</label>
                  <input name="price" value={formData.price} onChange={handleChange} className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm white focus:border-yellow-500/50" />
                </div>
             </div>
             
             <label className="text-xs font-semibold text-white/70 uppercase mt-3 mb-1">Servicios (Checkboxes Rápidos)</label>
             <div className="flex flex-wrap gap-2">
                 {SERVICES_LIST.map(s => (
                   <button key={s} onClick={() => toggleService(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 shrink-0 ${services.includes(s) ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/40" : "bg-white/5 border-white/10 text-white/60"}`}>
                      {services.includes(s) && <Check size={12} className="stroke-[3]" />}
                      {s}
                   </button>
                 ))}
             </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-white/10 pt-5">
             <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
               <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
               Automatización de Envío
             </h2>
             <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="sendEmail" checked={formData.sendEmail} onChange={handleChange} className="w-4 h-4 rounded text-yellow-500 border-white/20 bg-white/10" />
                <span className="text-sm font-medium">¿Enviar contrato por Email al miembro?</span>
             </label>
             {formData.sendEmail && (
                <div className="mt-3 flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-2">
                   <Mail size={16} className="text-white/40 ml-2" />
                   <input disabled value="Se extraerá de la ficha y se enviará 🚀" className="bg-transparent text-sm w-full outline-none text-white/50" />
                </div>
             )}
          </div>

          <GlowButton 
            onClick={processFusion} 
            disabled={!imageBase64 || step !== "idle"} 
            className="w-full py-4 mt-2 !bg-gradient-to-r !from-yellow-600 !to-red-600 hover:!from-yellow-500 hover:!to-red-500 !shadow-[0_0_20px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2 text-white font-bold text-lg border border-yellow-400/50"
          >
            {step === "idle" && <><Zap size={20} className="fill-white"/> Ejecutar Fusión Mágica</>}
            {step === "reading" && <><Loader2 size={20} className="animate-spin"/> Inteligencia Visual Activa...</>}
            {step === "generating" && <><Loader2 size={20} className="animate-spin"/> Redactando Contrato Legal...</>}
            {step === "done" && <><CheckCircle2 size={20}/> ¡Fusión Completada!</>}
          </GlowButton>
        </div>

        {/* Right Column: Output Fusion (Data + PDF Preview) */}
        <div className="flex flex-col gap-4">
           
           {/* Step 1 Extracted Data Card */}
           {extractedData && (
             <div className="bg-white/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-2 shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-right-8">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="text-emerald-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wider mb-2">
                   <CheckCircle2 size={16}/> Datos Extraídos de la Ficha
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm z-10">
                   {Object.entries(extractedData).map(([key, value]) => (
                     <div key={key} className="flex flex-col border-b border-white/5 pb-1">
                        <span className="text-white/40 text-xs uppercase font-medium">{key.replace(/_/g, ' ')}</span>
                        <span className="text-white font-semibold truncate" title={String(value)}>{String(value)}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Step 2 Document Preview */}
           <div className="bg-[#eef2f6] border border-white/10 rounded-2xl flex flex-col flex-1 min-h-[500px] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
              <div className="bg-[#1e293b] p-3 text-white flex justify-between items-center shadow-md z-10 shrink-0 border-b border-white/5">
                 <span className="font-semibold flex items-center gap-2 text-sm text-yellow-50"><FileText size={16} className="text-yellow-400" /> Contrato Final Automático</span>
                 <button 
                   onClick={handlePrint}
                   disabled={!contractHtml} 
                   className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold transition-all ${contractHtml ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-[#334155] text-white/30 cursor-not-allowed"}`}
                 >
                    <Printer size={14} /> Imprimir / PDF
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-10 relative flex justify-center bg-[#f1f5f9]">
                 {!contractHtml && step !== "generating" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-100 p-8 text-center gap-4">
                       <Zap size={64} className="opacity-20 text-yellow-500" />
                       <p className="max-w-xs text-sm">El contrato se renderizará mágicamente en este visor PDF al completar la Fusión.</p>
                    </div>
                 )}

                 {step === "generating" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-20 transition-opacity">
                       <div className="flex flex-col items-center gap-4 text-blue-600">
                         <Loader2 size={40} className="animate-spin" />
                         <span className="font-bold text-sm tracking-widest uppercase">Estructurando Legalmente...</span>
                       </div>
                    </div>
                 )}

                 {contractHtml && (
                    <div 
                      ref={printRef}
                      className="bg-white w-full max-w-[800px] text-slate-800 p-8 shadow-sm text-[13px] leading-relaxed border border-slate-200 min-h-[100%] transition-opacity animate-in zoom-in-95 duration-500"
                      dangerouslySetInnerHTML={{ __html: contractHtml }}
                    />
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
