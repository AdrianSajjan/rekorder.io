#!/bin/bash

echo "Generating supabase types..."
supabase gen types typescript --local > packages/database/src/lib/cloud/supabase.types.ts 
