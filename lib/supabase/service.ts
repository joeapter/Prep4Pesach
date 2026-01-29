import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseServiceReady = Boolean(supabaseUrl && serviceKey);

export const supabaseService = createClient(supabaseUrl || 'http://localhost:54321', serviceKey || 'missing', {
  auth: { persistSession: false }
});
