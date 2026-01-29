import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { createSupabaseCookieMethods } from '@/lib/supabase/cookie-methods';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase client configuration.');
}

export const createServerClient = () =>
  createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: createSupabaseCookieMethods()
  });
