
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function useMakeAdmin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const makeUserAdmin = async () => {
      setLoading(true);
      try {
        // First, we need to get the ID for the user with email slavastinov@gmail.com
        const { data: authUser, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', '27e2a9dc-60e4-45fd-98ab-31210b02ea2a')
          .single();

        if (userError) {
          toast({
            title: "Error finding user",
            description: userError.message,
            variant: "destructive",
          });
          return;
        }

        // Update the user's role to admin
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', '27e2a9dc-60e4-45fd-98ab-31210b02ea2a');

        if (updateError) {
          toast({
            title: "Error updating user role",
            description: updateError.message,
            variant: "destructive",
          });
          return;
        }

        setSuccess(true);
        toast({
          title: "Admin access granted",
          description: "User slavastinov@gmail.com now has admin access.",
        });
      } catch (error) {
        console.error("Error making user admin:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    makeUserAdmin();
  }, []);

  return { loading, success };
}
