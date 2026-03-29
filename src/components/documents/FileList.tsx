"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DocumentMetadata, documentService } from "@/lib/services/documents";
import {
  FileText, FileImage, FileSpreadsheet, FileArchive, FileCode,
  Download, Trash2, HardDrive, File
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface FileListProps {
  documents: DocumentMetadata[];
  onDelete: (id: string, path: string) => void;
  view?: "grid" | "list";
}

const FILE_ICONS: Record<string, { icon: typeof FileText; color: string }> = {
  pdf:  { icon: FileText,        color: "text-red-400" },
  png:  { icon: FileImage,       color: "text-blue-400" },
  jpg:  { icon: FileImage,       color: "text-blue-400" },
  jpeg: { icon: FileImage,       color: "text-blue-400" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-400" },
  xls:  { icon: FileSpreadsheet, color: "text-green-400" },
  csv:  { icon: FileSpreadsheet, color: "text-green-400" },
  zip:  { icon: FileArchive,     color: "text-yellow-400" },
  doc:  { icon: FileText,        color: "text-blue-300" },
  docx: { icon: FileText,        color: "text-blue-300" },
  txt:  { icon: FileCode,        color: "text-white/60" },
};

function getFileInfo(contentType?: string | null, name?: string) {
  const ext = name?.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || { icon: File, color: "text-white/40" };
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FileList({ documents, onDelete, view = "grid" }: FileListProps) {
  if (documents.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
        <FileText size={48} className="text-white/10 mx-auto mb-4" />
        <p className="text-white/20 font-medium">El repositorio está vacío.</p>
        <p className="text-white/10 text-sm mt-1">Sube tu primer documento para comenzar.</p>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden divide-y divide-white/5">
        {documents.map((doc) => {
          const { icon: Icon, color } = getFileInfo(doc.content_type, doc.name);
          const downloadUrl = documentService.getPublicUrl(doc.file_path);
          return (
            <div key={doc.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
              <div className={`p-2 rounded-xl bg-white/5 flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-[var(--color-primary)] transition-colors">{doc.name}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/30 mt-0.5">
                  <span className="flex items-center gap-1"><HardDrive size={9} /> {formatSize(doc.file_size)}</span>
                  <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  <span className="uppercase">{doc.content_type?.split("/")[1] || "file"}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                  <Download size={15} />
                </a>
                <button onClick={() => onDelete(doc.id, doc.file_path)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {documents.map((doc) => {
        const { icon: Icon, color } = getFileInfo(doc.content_type, doc.name);
        const downloadUrl = documentService.getPublicUrl(doc.file_path);
        return (
          <GlassCard key={doc.id} className="p-5 group hover:-translate-y-1 hover:bg-white/10 transition-all duration-500 flex flex-col h-full">
            <div className="flex justify-between items-start mb-5">
              <div className={`p-3 rounded-2xl bg-white/5 flex-shrink-0 ${color}`}>
                <Icon size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                  <Download size={15} />
                </a>
                <button onClick={() => onDelete(doc.id, doc.file_path)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="flex-grow">
              <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">{doc.name}</h4>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                <HardDrive size={9} /> {formatSize(doc.file_size)}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-white/20 font-bold">{new Date(doc.created_at).toLocaleDateString()}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 ${color}`}>
                {doc.content_type?.split("/")[1] || "file"}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[inherit]" />
          </GlassCard>
        );
      })}
    </div>
  );
}
