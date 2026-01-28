import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase/route';
import { supabaseService } from '@/lib/supabase/service';

type SlotGenerationBody = {
  start_at: string;
  end_at: string;
  block_minutes: number;
  buffer_minutes: number;
  capacity_workers: number;
};

export async function POST(req: Request) {
  const body: SlotGenerationBody = await req.json();
  const validationError = validateBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
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
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const { data: availability } = await supabaseService
    .from('worker_availability')
    .select('*')
    .lt('start_at', body.end_at)
    .gt('end_at', body.start_at);

  const slots = buildSlots(availability ?? [], profile.id, body);
  if (slots.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const { error } = await supabaseService.from('slots').insert(slots, { onConflict: 'start_at,end_at' });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ created: slots.length });
}

function validateBody(body: SlotGenerationBody) {
  if (!body.start_at || !body.end_at) return 'Start/end date required.';
  if (isNaN(Date.parse(body.start_at)) || isNaN(Date.parse(body.end_at))) return 'Invalid dates.';
  if (body.block_minutes <= 0) return 'Block length must be positive.';
  if (body.capacity_workers <= 0) return 'Capacity must be at least one.';
  return null;
}

function buildSlots(availability: Array<{ start_at: string; end_at: string }>, adminId: string, body: SlotGenerationBody) {
  const slots: Array<Record<string, unknown>> = [];
  const rangeStart = new Date(body.start_at).getTime();
  const rangeEnd = new Date(body.end_at).getTime();
  const blockDurationMs = body.block_minutes * 60_000;
  const bufferMs = body.buffer_minutes * 60_000;

  availability.forEach((item) => {
    const blockStart = Math.max(rangeStart, new Date(item.start_at).getTime());
    const blockEnd = Math.min(rangeEnd, new Date(item.end_at).getTime());
    let cursor = blockStart;

    while (cursor + blockDurationMs <= blockEnd) {
      const slotStart = new Date(cursor).toISOString();
      const slotEnd = new Date(cursor + blockDurationMs).toISOString();
      slots.push({
        start_at: slotStart,
        end_at: slotEnd,
        capacity_workers: body.capacity_workers,
        created_by: adminId,
        status: 'open'
      });
      cursor += blockDurationMs + bufferMs;
    }
  });

  return slots;
}
