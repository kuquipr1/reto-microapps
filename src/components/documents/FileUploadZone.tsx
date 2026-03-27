"use client";

import { useState, useRef } from "react";
import { Upload, File, Loader2 } from "lucide-react";
import { documentService } from "@/lib/services/documents";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface FileUploadZoneProps {
  onSuccess: () => void;
}

export function FileUploadZone({ onSuccess }: FileUploadZoneProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentService.uploadFile(file);
      toast("Archivo subido con éxito", "success");
      onSuccess();
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[var(--color-primary)]/50 rounded-3xl p-12 transition-all duration-500 bg-white/2 hover:bg-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/0 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 text-white/40 group-hover:text-[var(--color-primary)] group-hover:scale-110 transition-all duration-500">
          {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
        </div>
        <div>
          <p className="text-lg font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
            {uploading ? "Subiendo..." : t("documents.upload")}
          </p>
          <p className="text-sm text-white/40">Suelte archivos aquí o haga clic para buscar</p>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />
    </div>
  );
}
