"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { documentService } from "@/lib/services/documents";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface FileUploadZoneProps {
  onSuccess: () => void;
}

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.csv,.zip";

export function FileUploadZone({ onSuccess }: FileUploadZoneProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploaded(false);
    try {
      await documentService.uploadFile(file);
      toast(`"${file.name}" subido con éxito`, "success");
      setUploaded(true);
      onSuccess();
      setTimeout(() => setUploaded(false), 2000);
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleUpload(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div
      onClick={() => !uploading && fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-500 overflow-hidden
        ${dragging
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.01]"
          : uploaded
          ? "border-green-500/50 bg-green-500/10"
          : "border-white/10 hover:border-[var(--color-primary)]/50 bg-white/2 hover:bg-white/5"
        }`}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/0 to-[var(--color-primary)]/8 transition-opacity duration-500
        ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

      {/* Drag rings */}
      {dragging && (
        <div className="absolute inset-4 border-2 border-[var(--color-primary)]/20 rounded-2xl animate-ping" />
      )}

      <div className="relative flex flex-col items-center justify-center text-center space-y-4">
        <div className={`p-5 rounded-2xl transition-all duration-500 ${
          uploaded
            ? "bg-green-500/20 text-green-400 scale-110"
            : dragging
            ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] scale-110"
            : "bg-white/5 text-white/40 group-hover:text-[var(--color-primary)] group-hover:scale-110"
        }`}>
          {uploading
            ? <Loader2 size={36} className="animate-spin" />
            : uploaded
            ? <CheckCircle2 size={36} />
            : <Upload size={36} />
          }
        </div>
        <div>
          <p className={`text-lg font-bold transition-colors ${
            uploaded ? "text-green-400" : dragging ? "text-[var(--color-primary)]" : "text-white group-hover:text-[var(--color-primary)]"
          }`}>
            {uploading ? "Subiendo archivo..." : uploaded ? "¡Subido!" : dragging ? "Suelta el archivo aquí" : t("documents.upload")}
          </p>
          {!uploading && !uploaded && (
            <p className="text-sm text-white/30 mt-1">Arrastra y suelta, o haz clic para buscar</p>
          )}
          {!uploading && !uploaded && (
            <p className="text-xs text-white/20 mt-2 font-mono">{ACCEPTED_TYPES}</p>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={ACCEPTED_TYPES}
        className="hidden"
      />
    </div>
  );
}
