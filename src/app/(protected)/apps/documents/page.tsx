"use client";

import { useEffect, useState, useMemo } from "react";
import { FileUploadZone } from "@/components/documents/FileUploadZone";
import { FileList } from "@/components/documents/FileList";
import { documentService, DocumentMetadata } from "@/lib/services/documents";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { FileStack, LayoutGrid, List, HardDrive, FileText, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";

export default function DocumentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error: any) {
      toast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string, path: string) => {
    if (confirm("¿Eliminar este documento permanentemente?")) {
      try {
        await documentService.deleteDocument(id, path);
        setDocuments(prev => prev.filter(d => d.id !== id));
        toast("Documento eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  const totalSize = documents.reduce((acc, d) => acc + d.file_size, 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const filteredDocs = useMemo(() =>
    documents.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.content_type?.toLowerCase().includes(search.toLowerCase())
    ),
    [documents, search]
  );

  if (loading) return (
    <div className="p-8 text-white/40 animate-pulse font-medium flex items-center gap-3">
      <FileStack size={20} className="animate-bounce" />
      Accediendo al repositorio...
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-4">
            <FileStack className="text-[var(--color-primary)]" />
            {t("documents.title")}
          </h1>
          <p className="text-white/40 font-medium max-w-2xl">
            Tu repositorio seguro para almacenar y compartir documentos importantes.
          </p>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Total Archivos</p>
            <p className="text-2xl font-black text-white">{documents.length}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] rounded-2xl">
            <HardDrive size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Almacenamiento Usado</p>
            <p className="text-2xl font-black text-white">{formatSize(totalSize)}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-5 flex items-center gap-4">
          <div className="p-3 bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)] rounded-2xl">
            <FileStack size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">Subidos Este Mes</p>
            <p className="text-2xl font-black text-white">
              {documents.filter(d => {
                const date = new Date(d.created_at);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Upload zone */}
      <section className="space-y-4">
        <p className="text-xs uppercase font-black text-white/20 tracking-[0.2em]">Carga de Archivos</p>
        <FileUploadZone onSuccess={fetchData} />
      </section>

      {/* Files section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs uppercase font-black text-white/20 tracking-[0.2em]">
            Documentos · {filteredDocs.length}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-grow sm:w-64">
              <Input
                placeholder="Buscar archivos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
                className="bg-white/5 border-white/10 h-10 text-sm"
              />
            </div>
            <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-[var(--color-primary)] text-white" : "text-white/40 hover:text-white"}`}
                title="Vista cuadrícula"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-[var(--color-primary)] text-white" : "text-white/40 hover:text-white"}`}
                title="Vista lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
        <FileList documents={filteredDocs} onDelete={handleDelete} view={view} />
      </section>
    </div>
  );
}
