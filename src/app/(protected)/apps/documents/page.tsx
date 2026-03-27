"use client";

import { useEffect, useState } from "react";
import { FileUploadZone } from "@/components/documents/FileUploadZone";
import { FileList } from "@/components/documents/FileList";
import { documentService, DocumentMetadata } from "@/lib/services/documents";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { FileStack, LayoutGrid, List } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function DocumentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleDelete = async (id: string, path: string) => {
    if (confirm("¿Eliminar este documento permanentemente?")) {
      try {
        await documentService.deleteDocument(id, path);
        setDocuments(documents.filter(d => d.id !== id));
        toast("Documento eliminado", "success");
      } catch (error: any) {
        toast(error.message, "error");
      }
    }
  };

  if (loading) return <div className="p-8 text-white/40 italic font-medium">Accediendo al archivo central...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-4">
            <FileStack className="text-[var(--color-primary)]" />
            {t("documents.title")}
          </h1>
          <p className="text-white/40 font-medium max-w-2xl">
            Su lugar seguro para almacenar y organizar archivos importantes con acceso inmediato desde cualquier lugar.
          </p>
        </div>
      </header>

      <section className="space-y-6">
        <h3 className="text-xs uppercase font-black text-white/30 tracking-[0.2em]">Carga de Archivos</h3>
        <FileUploadZone onSuccess={fetchData} />
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-black text-white/30 tracking-[0.2em]">{t("documents.title")} Recientes</h3>
            <div className="flex gap-2">
                <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white transition-all">
                    <LayoutGrid size={16} />
                </button>
            </div>
        </div>
        <FileList documents={documents} onDelete={handleDelete} />
      </section>
    </div>
  );
}
