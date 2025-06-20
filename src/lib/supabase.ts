import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://zanfdpuiblradrbtfzhl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmZkcHVpYmxyYWRyYnRmemhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDMwMTksImV4cCI6MjA2MjIxOTAxOX0.vOGXgtT7M4Vlrwt5vXIXW69VARao80gZCSfl2kgliZ0';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 