
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from './types';
import { fetchUserProfile } from './auth-utils';

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setLoading(true);
        const profileData = await fetchUserProfile(user.id);
        if (profileData) {
          setProfile(profileData as UserProfile);
        }
        setLoading(false);
      } else {
        setProfile(null);
      }
    };

    loadProfile();
  }, [user]);

  return { profile, loading };
}
