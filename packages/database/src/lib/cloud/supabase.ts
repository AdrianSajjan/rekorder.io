import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types';

export const SupabaseWebConfig = {
  projectUrl: 'https://mspinyaeumheehduengh.supabase.co',
  publicKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcGlueWFldW1oZWVoZHVlbmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTQxNzAsImV4cCI6MjA2NjU5MDE3MH0.ZRhDoJYoIKD-NJPjXbP71lUcSiczEAKeNxmapC7vC00',
};

export const supabase = createClient<Database>(SupabaseWebConfig.projectUrl, SupabaseWebConfig.publicKey);
