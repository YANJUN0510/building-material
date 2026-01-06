import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE || 'supabase';

export function useSupabaseAuthedClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (url, options = {}) => {
          const token = await getToken({ template: clerkJwtTemplate }).catch(() => null);
          const headers = new Headers(options.headers || {});
          if (token) headers.set('Authorization', `Bearer ${token}`);
          return globalThis.fetch(url, { ...options, headers });
        },
      },
    });
  }, [getToken]);
}

