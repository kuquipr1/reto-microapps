"use client";

import { useState, useRef } from "react";
import { PenTool, FileText, CheckCircle2, Bot, Printer, Check } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export default function ContratoFitPage() {
  const [formData, setFormData] = useState({
    memberName: "",
    plan: "Mensual",
    price: "",
    startDate: new Date().toISOString().split('T')[0],
    specialClauses: "",
  });

  const [services, setServices] = useState<string[]>(["Área de pesas"]);
  
  const SERVICES_LIST = ["Clases grupales", "Área de pesas", "Alberca", "Estacionamiento", "Casillero", "Sauna"];

  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleService = (service: string) => {
    setServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  const generateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberName || !formData.price) return;

    setIsGenerating(true);
    setGeneratedContract(null);

    try {
      const res = await fetch("/api/ai/contratofit/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          gymName: "FitZone Polanco",
          ...formData,
          services
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Parse markdown bold and headers roughly (since we don't have react-markdown here, we can do a simple replacement for bold and headers)
      let parsedHTML = data.result
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 border-b border-black/10 pb-1">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-4 mb-4 text-center">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n- /g, '<br/>• ')
        .replace(/\n/g, '<br/>');

      setGeneratedContract(parsedHTML);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
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
          <title>Imprimir Contrato - ${formData.memberName}</title>
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
             <div class="sign-box">${formData.memberName}<br/>(Firma del Titular)</div>
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
         <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent flex items-center gap-3">
          <PenTool size={32} className="text-orange-400" />
          ContratoFit
        </h1>
        <p className="text-white/60">
          Genera contratos de membresía legalmente robustos en segundos, sin abrir Word.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-2">
        {/* VIEW 1: FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl relative">
          <form onSubmit={generateContract} className="flex flex-col gap-4">
             <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
               <FileText className="text-orange-400" size={20} />
               Datos de la Membresía
             </h2>
             
             <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70 uppercase">Nombre Completo del Miembro</label>
                <input name="memberName" value={formData.memberName} onChange={handleFormChange} required placeholder="Ej. Roberto Sánchez López" className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase">Plan Elegido</label>
                  <select name="plan" value={formData.plan} onChange={handleFormChange} className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50">
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase">Precio Acordado</label>
                  <input name="price" value={formData.price} onChange={handleFormChange} required placeholder="$599 MXN" className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50" />
                </div>
             </div>

             <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70 uppercase">Fecha de Inicio</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 [color-scheme:dark]" />
             </div>

             <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-semibold text-white/70 uppercase">Servicios Incluidos</label>
                <div className="grid grid-cols-2 gap-2">
                   {SERVICES_LIST.map(s => (
                     <label key={s} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer whitespace-nowrap overflow-hidden transition-colors border ${services.includes(s) ? "bg-orange-500/20 border-orange-500/50 text-orange-100" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${services.includes(s) ? 'border-orange-400 bg-orange-500' : 'border-white/30'}`}>
                           {services.includes(s) && <Check size={10} className="text-[#111] stroke-[4]" />}
                        </div>
                        <span className="text-sm truncate font-medium">{s}</span>
                     </label>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-semibold text-white/70 uppercase">Cláusulas Especiales (Opcional)</label>
                <textarea name="specialClauses" value={formData.specialClauses} onChange={handleFormChange} rows={2} placeholder="Ej. Primer mes al 50% de descuento. No incluye toalla." className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none" />
             </div>

             <GlowButton type="submit" disabled={isGenerating || !formData.memberName || !formData.price} className="w-full py-4 mt-4 !bg-orange-600 hover:!bg-orange-500 !shadow-[0_0_15px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2">
               {isGenerating ? <Bot className="animate-spin" size={18} /> : <PenTool size={18} />} 
               {isGenerating ? "Redactando Legalmente..." : "Generar Contrato (IA)"}
             </GlowButton>
          </form>
        </div>

        {/* VIEW 2: PDF PREVIEW */}
        <div className="bg-[#f8f9fa] border border-white/10 rounded-2xl flex flex-col h-[650px] shadow-2xl overflow-hidden relative">
           <div className="bg-[#2a2a2a] p-3 text-white flex justify-between items-center shadow-lg z-10">
              <span className="font-semibold flex items-center gap-2"><FileText size={18} /> Vista Previa del Documento</span>
              <button 
                onClick={handlePrint}
                disabled={!generatedContract} 
                className={`p-2 px-4 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors ${generatedContract ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-[#444] text-white/50 cursor-not-allowed"}`}
              >
                 <Printer size={16} /> Print PDF
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 relative flex shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] justify-center">
              {!generatedContract && !isGenerating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-[#999] opacity-100 transition-opacity p-8 text-center gap-4">
                    <FileText size={64} className="opacity-20" />
                    <p>Llena los datos a la izquierda para generar automáticamente el contrato. El documento aparecerá aquí listo para imprimir.</p>
                 </div>
              )}

              {isGenerating && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20 transition-opacity">
                    <div className="flex flex-col items-center gap-4 text-orange-500 bg-white p-6 rounded-2xl shadow-xl border border-black/5">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                         <Bot size={24} className="animate-spin" />
                      </div>
                      <span className="font-bold">Analizando variables y adaptando cláusulas legales...</span>
                    </div>
                 </div>
              )}

              {generatedContract && (
                 <div 
                   ref={printRef}
                   className="bg-white w-full max-w-[800px] text-[#222] p-8 shadow-sm text-sm border border-[#ddd] min-h-[900px] transition-opacity"
                   dangerouslySetInnerHTML={{ __html: generatedContract }}
                 />
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
