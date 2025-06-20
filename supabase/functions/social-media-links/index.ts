import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

// Default fallback links
const DEFAULT_LINKS: SocialMediaLink[] = [
  { id: '1', platform: "Facebook", url: "https://facebook.com", icon: "Facebook", is_active: true, display_order: 1 },
  { id: '2', platform: "Instagram", url: "https://instagram.com", icon: "Instagram", is_active: true, display_order: 2 },
  { id: '3', platform: "TikTok", url: "https://tiktok.com", icon: "TikTok", is_active: true, display_order: 3 },
  { id: '4', platform: "Twitter", url: "https://twitter.com", icon: "Twitter", is_active: true, display_order: 4 },
  { id: '5', platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", is_active: true, display_order: 5 },
];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    console.log(`[social-media-links] Received ${req.method} request`);
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || 'https://zanfdpuiblradrbtfzhl.supabase.co';
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '';
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbmZkcHVpYmxyYWRyYnRmemhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDMwMTksImV4cCI6MjA2MjIxOTAxOX0.vOGXgtT7M4Vlrwt5vXIXW69VARao80gZCSfl2kgliZ0';

    if (!supabaseServiceKey) {
      console.error("[social-media-links] Missing Supabase service role key");
      if (req.method === 'GET') {
        // For GET requests, return default links even without service key
        return new Response(JSON.stringify(DEFAULT_LINKS), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        // For write operations, require service key
        return new Response(JSON.stringify({ error: 'Server configuration error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // Create a Supabase admin client to access database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // For read-only operations (GET), allow without authentication
    if (req.method === 'GET') {
      console.log("[social-media-links] Processing GET request");
      // Get social media links from the database
      const { data, error } = await supabaseAdmin
        .from('social_media_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error("[social-media-links] Error fetching social media links:", error);
        return new Response(JSON.stringify(DEFAULT_LINKS), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      console.log(`[social-media-links] Successfully fetched ${data?.length || 0} links`);
      // Return the links (or default if no data)
      return new Response(JSON.stringify(data && data.length > 0 ? data : DEFAULT_LINKS), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } 
    
    // For write operations (POST, PUT, DELETE), require authentication
    // Extract and verify the JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("[social-media-links] Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("[social-media-links] Got token from auth header");
    
    // Create a Supabase client for authentication verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verify the token
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    
    if (authError || !user) {
      console.error("[social-media-links] Authentication error:", authError);
      return new Response(JSON.stringify({ 
        error: 'Unauthorized: Invalid token',
        details: authError?.message || 'User authentication failed'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    
    console.log(`[social-media-links] User authenticated: ${user.id}`);
    
    // Get user profile for logging purposes only (no longer restricting by role)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn(`[social-media-links] Could not fetch profile for user ${user.id}: ${profileError.message}`);
    } else {
      console.log(`[social-media-links] User role: ${profile?.role || 'unknown'}`);
    }
    
    // Handle write operations
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      console.log("[social-media-links] Processing POST request");
      // Parse the request body
      const requestData = await req.json();
      console.log("[social-media-links] Request data:", JSON.stringify(requestData));
      
      // Create a new social media link
      const { data, error } = await supabaseAdmin
        .from('social_media_links')
        .insert(requestData)
        .select();

      if (error) {
        console.error("[social-media-links] Error inserting:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      console.log("[social-media-links] Successfully inserted new link");
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    else if (req.method === 'PUT' && req.headers.get('content-type')?.includes('application/json')) {
      console.log("[social-media-links] Processing PUT request");
      // Parse the request body
      const requestData = await req.json();
      console.log(`[social-media-links] Raw request data: ${JSON.stringify(requestData)}`);
      
      const id = requestData.id;
      console.log(`[social-media-links] Updating link with ID: ${id}`);
      
      if (!id) {
        console.error("[social-media-links] Missing ID in PUT request");
        return new Response(JSON.stringify({ error: 'Missing ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      
      // Ensure required fields are present
      const validatedData = {
        id: id,
        platform: requestData.platform || '',
        url: requestData.url || '',
        icon: requestData.icon || '',
        is_active: typeof requestData.is_active === 'boolean' ? requestData.is_active : true,
        display_order: typeof requestData.display_order === 'number' ? requestData.display_order : 0,
        updated_at: new Date().toISOString()
      };
      
      console.log(`[social-media-links] Validated data: ${JSON.stringify(validatedData)}`);

      // Update an existing social media link
      try {
        const { data, error } = await supabaseAdmin
          .from('social_media_links')
          .update(validatedData)
          .eq('id', id)
          .select();

        if (error) {
          console.error("[social-media-links] Database error on update:", error);
          return new Response(JSON.stringify({ error: error.message, details: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          });
        }

        console.log("[social-media-links] Successfully updated link:", data);
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } catch (updateError) {
        console.error("[social-media-links] Unexpected error during update:", updateError);
        return new Response(JSON.stringify({ error: 'Server error during update', details: updateError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
    else if (req.method === 'DELETE') {
      console.log("[social-media-links] Processing DELETE request");
      // Parse the URL to get the ID
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      console.log(`[social-media-links] Deleting link with ID: ${id}`);
      
      if (!id) {
        console.error("[social-media-links] Missing ID in DELETE request");
        return new Response(JSON.stringify({ error: 'Missing ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      
      // Delete a social media link
      const { error } = await supabaseAdmin
        .from('social_media_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("[social-media-links] Error deleting:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      console.log("[social-media-links] Successfully deleted link");
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Method not allowed
    console.error(`[social-media-links] Method not allowed: ${req.method}`);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error("[social-media-links] Unexpected error:", error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}); 