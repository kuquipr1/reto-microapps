"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DocumentMetadata, documentService } from "@/lib/services/documents";
import { FileText, Download, Trash2, ExternalLink, HardDrive } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface FileListProps {
  documents: DocumentMetadata[];
  onDelete: (id: string, path: string) => void;
}

export function FileList({ documents, onDelete }: FileListProps) {
  const { t } = useLanguage();

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((doc) => (
        <GlassCard key={doc.id} className="p-5 group hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-white/5 text-[var(--color-primary)] shadow-inner">
               <FileText size={24} />
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={documentService.getPublicUrl(doc.file_path)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
                >
                    <Download size={16} />
                </a>
                <button 
                  onClick={() => onDelete(doc.id, doc.file_path)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/60 hover:text-red-400 transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
          </div>

          <div className="flex-grow">
            <h4 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{doc.name}</h4>
            <div className="flex items-center gap-2 text-[10px] font-medium text-white/30 uppercase tracking-widest">
                <HardDrive size={10} />
                {formatSize(doc.file_size)}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-bold">{new Date(doc.created_at).toLocaleDateString()}</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-white/40 uppercase">{doc.content_type?.split('/')[1] || "File"}</span>
          </div>
        </GlassCard>
      ))}

      {documents.length === 0 && (
         <div className="col-span-full py-20 text-center text-white/20 font-medium italic">
            El baúl de documentos está vacío... explorando el vacío.
         </div>
      )}
    </div>
  );
}
