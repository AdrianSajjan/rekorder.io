-- Add original_thumbnail and modified_thumbnail columns to recordings table
ALTER TABLE public.recordings 
ADD COLUMN original_thumbnail TEXT,
ADD COLUMN modified_thumbnail TEXT;

-- Add comment to describe the columns
COMMENT ON COLUMN public.recordings.original_thumbnail IS 'Path or URL to the original thumbnail image';
COMMENT ON COLUMN public.recordings.modified_thumbnail IS 'Path or URL to the modified thumbnail image';

-- Add comments for existing columns
COMMENT ON COLUMN public.recordings.id IS 'Unique identifier for the recording';
COMMENT ON COLUMN public.recordings.user_id IS 'Reference to the user who owns this recording';
COMMENT ON COLUMN public.recordings.project_name IS 'Name of the project this recording belongs to';
COMMENT ON COLUMN public.recordings.original_file IS 'Path or URL to the original recording file';
COMMENT ON COLUMN public.recordings.modified_file IS 'Path or URL to the modified recording file';
COMMENT ON COLUMN public.recordings.created_at IS 'Timestamp when the recording was created';
COMMENT ON COLUMN public.recordings.updated_at IS 'Timestamp when the recording was last updated';
