CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  original_file TEXT NOT NULL,
  modified_file TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own recordings
CREATE POLICY "Users can view their own recordings" 
  ON public.recordings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own recordings
CREATE POLICY "Users can insert their own recordings" 
  ON public.recordings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own recordings
CREATE POLICY "Users can update their own recordings" 
  ON public.recordings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own recordings
CREATE POLICY "Users can delete their own recordings" 
  ON public.recordings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to automatically set the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.recordings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
