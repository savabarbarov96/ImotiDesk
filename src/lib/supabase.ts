import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frfplhezrpppfzfungwk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZnBsaGV6cnBwcGZ6ZnVuZ3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTQwMzMsImV4cCI6MjA2MDM3MDAzM30.yG0_Hcd7LLlGrU7GNon_jyG9dumO1jkM-mh4SEJxdi0';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 