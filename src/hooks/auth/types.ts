export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'public' | 'authenticated' | 'agent' | 'admin';
  created_at: string | null;
  updated_at: string | null;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmation_sent_at: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: Record<string, any>;
    identities: Array<Record<string, any>>;
    created_at: string;
    updated_at: string;
  };
}
