import { createClient } from '@supabase/supabase-js';

export const SupabaseWebConfig = {
  projectUrl: 'https://ksqlsjjechcuqkmycczf.supabase.co',
  publicKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcWxzamplY2hjdXFrbXljY3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTg3NDUsImV4cCI6MjA1MTkzNDc0NX0.IguRVKtyRvBADmTqs3RUVcm75BvfbAUM8hdxd59zeaI',
};

export const supabase = createClient(SupabaseWebConfig.projectUrl, SupabaseWebConfig.publicKey);
