import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';

// Use the same URL as in the frontend
const supabaseUrl = 'https://zanfdpuiblradrbtfzhl.supabase.co';
// The service role key needs to be set in the Supabase dashboard
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Validate authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user is authenticated and has admin role
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Parse request body
    const { action, userData } = await req.json();

    // Handle different operations based on the request
    switch (action) {
      case 'list':
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*, auth.users!inner(email, created_at)')
          .order('created_at', { ascending: false });

        if (usersError) {
          console.error('Error fetching users:', usersError);
          throw new Error('Failed to fetch users');
        }
        
        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'create':
        // Validate required fields
        if (!userData?.email || !userData?.password || !userData?.role) {
          throw new Error('Missing required fields');
        }

        // Validate role
        if (!['authenticated', 'admin'].includes(userData.role)) {
          throw new Error('Invalid role. Must be either "authenticated" or "admin"');
        }

        try {
          // Create new user
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
          });

          if (createError) {
            console.error('Error creating user:', createError);
            throw createError;
          }

          // Create profile
          const { error: profileCreateError } = await supabase.from('profiles').upsert({
            id: newUser.user.id,
            full_name: userData.full_name || null,
            role: userData.role,
            email: userData.email,
          });

          if (profileCreateError) {
            console.error('Error creating profile:', profileCreateError);
            // If profile creation fails, delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(newUser.user.id);
            throw profileCreateError;
          }

          return new Response(JSON.stringify({ user: newUser }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          });
        } catch (error) {
          console.error('Error in user creation process:', error);
          throw new Error(`Database error creating new user: ${error.message}`);
        }

      case 'update':
        // Validate required fields
        if (!userData?.id || !userData?.role) {
          throw new Error('Missing required fields');
        }

        // Validate role
        if (!['authenticated', 'admin'].includes(userData.role)) {
          throw new Error('Invalid role. Must be either "authenticated" or "admin"');
        }

        // Update profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name || null,
            role: userData.role,
          })
          .eq('id', userData.id);

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      case 'delete':
        // Validate required fields
        if (!userData?.id) {
          throw new Error('Missing user ID');
        }

        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          userData.id
        );

        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          throw deleteError;
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in manage-users function:', error);
    
    const status = error.message.includes('Unauthorized') ? 401 :
                  error.message.includes('Missing') ? 400 :
                  error.message.includes('Invalid') ? 400 : 500;

    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: error.stack
    }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 