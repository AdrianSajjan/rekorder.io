-- Add document_markdown column to recordings table
ALTER TABLE public.recordings 
ADD COLUMN document_markdown TEXT;
