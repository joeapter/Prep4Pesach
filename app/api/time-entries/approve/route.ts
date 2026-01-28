import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';
import { supabaseService } from '@/lib/supabase/service';

type ApprovalBody = {
  entry_id: string;
  approve: boolean;
};

export async function POST(req: Request) {
  const body: ApprovalBody = await req.json();
  if (!body.entry_id) {
    return NextResponse.json({ error: 'Time entry ID required.' }, { status: 400 });
  }

  const supabase = createRouteSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', session.user.id)
    .single();

  if (!profile?.id || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin credentials required.' }, { status: 403 });
  }

  const status = body.approve ? 'approved' : 'rejected';
  const { error } = await supabaseService
    .from('time_entries')
    .update({
      status,
      approved_by: profile.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', body.entry_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status });
}
