"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2, FileDown, Copy, Check, FileJson } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

const FIELD_OPTIONS = [
  { id: "nombre", label: "Nombre Completo" },
  { id: "teléfono", label: "Teléfono" },
  { id: "email", label: "Email" },
  { id: "fecha_de_nacimiento", label: "Fecha de Nacimiento" },
  { id: "plan_elegido", label: "Plan Elegido" },
  { id: "condición_medica", label: "Condición Médica" },
  { id: "objetivo", label: "Objetivo Fitness" },
  { id: "firma", label: "Firma (Presente/Ausente)" },
];

export default function FichaFitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>(FIELD_OPTIONS.map(f => f.id));
  const [outputFormat, setOutputFormat] = useState("table");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageBase64(ev.target?.result as string);
        setExtractedData(null);
      };
      reader.readAsDataURL(selected);
    }
  };

  const toggleField = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const processForm = async () => {
    if (!imageBase64 || selectedFields.length === 0) return;
    
    setIsProcessing(true);
    setExtractedData(null);
    
    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          fields: selectedFields,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la ficha.");
      
      setExtractedData(data.result);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedData) return;
    const jsonStr = JSON.stringify(extractedData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    if (!extractedData) return;
    const headers = Object.keys(extractedData).join(",");
    const values = Object.values(extractedData).map(v => `"${v}"`).join(",");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + values;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fichafit_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          FichaFit 📄⚡
        </h1>
        <p className="text-white/60">
          Digitaliza fichas de inscripción en segundos. Sube la foto y la IA hará el resto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
          
          {/* File Upload */}
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-white/90">Paso 1: Archivo a subir</h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                hidden 
              />
              {imageBase64 ? (
                 <div className="w-full h-full p-2 relative">
                   <img src={imageBase64} alt="Ficha preview" className="w-full h-full object-contain rounded-lg shadow-md mix-blend-lighten" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                     <p className="font-semibold">Cambiar Archivo</p>
                   </div>
                 </div>
              ) : (
                <>
                  <UploadCloud size={32} className="text-[var(--color-primary)]" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Click para subir foto/escaneo</p>
                    <p className="text-xs text-white/50 mt-1">Soporta JPG, PNG</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Fields Selection */}
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-white/90">Paso 2: Campos a extraer</h3>
            <div className="grid grid-cols-2 gap-3">
              {FIELD_OPTIONS.map((field) => (
                <label 
                  key={field.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedFields.includes(field.id) 
                      ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedFields.includes(field.id)
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[#0A0520]'
                      : 'border-white/30 text-transparent'
                  }`}>
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="mt-4">
            <GlowButton 
              onClick={processForm} 
              disabled={!imageBase64 || selectedFields.length === 0 || isProcessing}
              className="w-full py-4 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Procesando con IA...
                </>
              ) : (
                <>Convertir a Datos</>
              )}
            </GlowButton>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
           <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
              <h3 className="font-medium text-white/90 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                Resultado Estructurado
              </h3>
              
              {extractedData && (
                <div className="flex gap-2">
                   <button onClick={handleCopy} className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg flex items-center gap-2 text-xs transition-colors">
                     {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                     <span className="hidden sm:inline">JSON</span>
                   </button>
                   <button onClick={exportCSV} className="p-2 bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-lg flex items-center gap-2 text-xs transition-colors">
                     <FileDown size={14} />
                     <span className="hidden sm:inline">CSV</span>
                   </button>
                </div>
              )}
           </div>
           
           <div className="p-6 flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
             <div>
               {!extractedData && !isProcessing && (
                 <div 
                   className="text-center flex flex-col items-center gap-3 text-white/40 opacity-100 transition-opacity"
                 >
                   <FileJson size={48} className="opacity-50" />
                   <p className="max-w-xs text-sm">Sube una ficha de inscripción y la IA extraerá todos los campos seleccionados aquí automáticamente.</p>
                 </div>
               )}

               {isProcessing && (
                 <div 
                   className="flex flex-col items-center gap-4 text-[var(--color-primary)] transition-opacity"
                 >
                   <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] animate-spin" />
                   <p className="text-sm font-medium animate-pulse">Analizando imagen y extrayendo texto...</p>
                 </div>
               )}

               {extractedData && !isProcessing && (
                  <div 
                    className="w-full h-full absolute inset-0 p-6 overflow-y-auto transition-opacity"
                  >
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <tbody>
                         {Object.entries(extractedData).map(([key, value], idx) => (
                           <tr key={key} className={`border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/5' : ''}`}>
                             <td className="py-3 px-4 font-medium text-white/50 capitalize border-r border-white/5 w-1/3">
                               {key.replace(/_/g, ' ')}
                             </td>
                             <td className="py-3 px-4 text-white/90 whitespace-normal font-semibold">
                               {value}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                    </table>
                  </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
