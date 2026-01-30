import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabaseClient = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
  options: {
    auth: {
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-application-name': 'prep4pesach'
      }
    }
  }
});
