import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';
import { supabaseService } from '@/lib/supabase/service';

type JobCreationBody = {
  slot_id: string;
  address_text: string;
  notes?: string;
  hourly_rate_cents: number;
  requested_team_size: number;
};

export async function POST(req: Request) {
  const body: JobCreationBody = await req.json();
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

  if (!profile || profile.role !== 'client') {
    return NextResponse.json({ error: 'Only clients may create jobs.' }, { status: 403 });
  }

  const { data: clientRecord } = await supabase.from('clients').select('id').eq('profile_id', profile.id).single();
  if (!clientRecord) {
    return NextResponse.json({ error: 'Client record not found.' }, { status: 404 });
  }

  const { data: job, error } = await supabaseService
    .from('jobs')
    .insert({
      client_id: clientRecord.id,
      slot_id: body.slot_id,
      address_text: body.address_text,
      notes: body.notes ?? '',
      hourly_rate_cents: body.hourly_rate_cents,
      requested_team_size: body.requested_team_size,
      status: 'booked'
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseService.from('slots').update({ status: 'booked' }).eq('id', body.slot_id);

  return NextResponse.json(job);
}
