import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { supabaseService, supabaseServiceReady } from '@/lib/supabase/service';

export async function requireAdmin() {
  if (!supabaseServiceReady) {
    redirect('/login');
  }

  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabaseService
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/login');
  }

  return { user, supabaseService };
}
