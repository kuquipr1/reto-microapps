"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { AutofillBadges, AutofillPreset } from "./AutofillBadges";
import { DynamicForm, FormFieldSchema } from "./DynamicForm";
import { Sparkles, FileText, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import ReactMarkdown from "react-markdown";

export interface MicroAppConfig {
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  form_schema: FormFieldSchema[];
  autofill_presets: AutofillPreset[];
  prompt_template: string;
}

export function MicroAppRunner({ app }: { app: MicroAppConfig }) {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [responseLanguage, setResponseLanguage] = useState<"es" | "en">("es");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillPreset = (values: Record<string, string>) => {
    setFormValues(values);
    toast(language === "en" ? "Preset applied!" : "¡Plantilla aplicada!", "success");
  };

  const checkRequiredFields = () => {
    for (const field of app.form_schema) {
      const fieldName = field.name || field.id || "";
      if (field.required && !formValues[fieldName]) {
        const errorLabel = language === "en" ? field.label_en : field.label_es;
        toast(language === "en" ? `Field "${errorLabel}" is required.` : `El campo "${errorLabel}" es obligatorio.`, "error");
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkRequiredFields()) return;

    setIsGenerating(true);
    try {
      // In a real implementation this calls an AI endpoint (/api/ai/generate)
      // passing the prompt_template dynamically mapped with formValues and responseLanguage
      
      // Simulate API delay for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      let finalPrompt = app.prompt_template;
      finalPrompt = finalPrompt.replace(/{{responseLanguage}}/g, responseLanguage === "es" ? "Español" : "English");
      
      // Map user values to the prompt just to show a mock result generated from template structure
      // Realistically we would send `finalPrompt` to OpenAI/Anthropic.
      
      setResult(`## Simulación de IA Exitosa ✨\n\nEl sistema recibió correctamente el formulario dinámico. Variables inyectadas en la petición:\n\n- Producto: **${formValues.product || 'N/A'}**\n- Objetivo: **${formValues.goal || 'N/A'}**\n- Cantidad: **${formValues.count || 'N/A'}**\n\nEsta es una vista previa simulada. Asegúrate de conectar el endpoint real de IA en \`handleGenerate\` dentro de \`MicroAppRunner.tsx\`.`);
    } catch (error) {
      toast("Error generating content", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast(language === "en" ? "Copied to clipboard!" : "¡Copiado al portapapeles!", "success");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8 pb-12 animate-in fade-in duration-700">
      
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          {language === "en" ? app.name_en : app.name_es}
        </h1>
        <p className="text-white/60 font-medium">
          {language === "en" ? app.description_en : app.description_es}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form Column */}
        <div className="space-y-6">
          <GlassCard className="p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)] to-transparent opacity-5 blur-[60px] rounded-full pointer-events-none" />
            
            <AutofillBadges presets={app.autofill_presets} onFill={handleFillPreset} />
            
            <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
              <DynamicForm 
                fields={app.form_schema} 
                values={formValues} 
                onChange={handleFieldChange}
                responseLanguage={responseLanguage}
                onChangeLanguage={setResponseLanguage}
              />

              <GlowButton 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 py-4 shadow-[0_0_20px_var(--color-primary)]/30 hover:shadow-[0_0_30px_var(--color-primary)]/50"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="animate-pulse">{language === "en" ? "Generating magic..." : "Generando magia..."}</span>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {language === "en" ? "Generate with AI" : "Generar con IA"}
                  </>
                )}
              </GlowButton>
            </form>
          </GlassCard>
        </div>

        {/* Output Column */}
        <div className="space-y-6 lg:sticky lg:top-8 h-full">
          {!result ? (
            <GlassCard className="p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center border-dashed border-white/20 bg-black/20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileText className="text-white/20" size={32} />
              </div>
              <p className="text-white/40 font-medium tracking-wide">
                {language === "en" ? "Your AI output will appear here" : "El resultado de la IA aparecerá aquí"}
              </p>
            </GlassCard>
          ) : (
            <div className="flex flex-col h-full bg-[#1A1429]/60 backdrop-blur-md rounded-2xl border border-[var(--color-primary)]/30 overflow-hidden shadow-2xl animate-in slide-in-from-right-4">
              <div className="p-4 bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 flex justify-between items-center">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                  {language === "en" ? "Generated Output" : "Contenido Generado"}
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-xs text-[var(--color-primary)] hover:text-white transition-colors bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/30 px-3 py-1.5 rounded-full font-medium"
                >
                  <Copy size={14} />
                  {language === "en" ? "Copy" : "Copiar"}
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-headings:text-white prose-a:text-[var(--color-primary)]">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
