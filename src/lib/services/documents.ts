import { createClient } from "@/lib/supabase/client";

export interface DocumentMetadata {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_size: number;
  content_type: string | null;
  folder: string;
  created_at: string;
  updated_at: string;
}

export const documentService = {
  async getDocuments() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as DocumentMetadata[];
  },

  async uploadFile(file: File) {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) throw new Error("User not authenticated");

    // 1. Upload to Storage
    const fileName = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Save Metadata
    const { data, error } = await supabase
      .from("documents")
      .insert([{
        user_id: userData.user.id,
        name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        content_type: file.type,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as DocumentMetadata;
  },

  async deleteDocument(id: string, filePath: string) {
    const supabase = createClient();
    
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (storageError) throw storageError;

    // 2. Delete Metadata
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  getPublicUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("documents").getPublicUrl(path);
    return data.publicUrl;
  }
};
