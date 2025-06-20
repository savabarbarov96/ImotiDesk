import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create a Supabase client with the user's token to verify they're admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { authorization: authHeader },
      },
    })

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      throw new Error('Access denied. Only admins can delete users.')
    }

    // Parse the request body
    const { user_id } = await req.json()

    // Don't allow deletion of the current user
    if (user_id === user.id) {
      throw new Error('Cannot delete your own account.')
    }

    // Create a Supabase client with service role for admin operations
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get the target user's role to prevent deleting other admins
    const { data: targetProfile, error: targetProfileError } = await supabaseServiceRole
      .from('profiles')
      .select('role')
      .eq('id', user_id)
      .single()

    if (targetProfileError) {
      throw new Error('User not found')
    }

    if (targetProfile.role === 'admin') {
      throw new Error('Cannot delete admin accounts.')
    }

    // Delete the user using admin API (this will also remove the profile due to CASCADE)
    const { error: deleteError } = await supabaseServiceRole.auth.admin.deleteUser(user_id)

    if (deleteError) {
      throw deleteError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 