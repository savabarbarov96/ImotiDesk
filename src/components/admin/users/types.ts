
import { UserProfile } from '@/hooks/auth/types';

export interface UserWithProfile extends UserProfile {
  email?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
}
