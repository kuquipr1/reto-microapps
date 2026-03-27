-- SQL schema for DocuVerse Metadata

-- Create document_metadata table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_size INTEGER NOT NULL,
  content_type TEXT,
  folder TEXT DEFAULT 'General' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own documents" 
ON public.documents FOR ALL USING (auth.uid() = user_id);

-- Note: User MUST create a bucket named 'documents' in Supabase Storage panel with public or restricted access as needed.
