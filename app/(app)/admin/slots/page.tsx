import { Card } from '@/components/ui/card';
import { SlotGenerator } from '@/components/admin/slot-generator';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminSlotsPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('slots')
    .select('id, start_at, end_at, capacity_workers, status, jobs(id, address_text)')
    .order('start_at', { ascending: true });
  const slots = data ?? [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Slot generation</p>
        <h2 className="text-2xl font-semibold text-white">Open slots from availability</h2>
      </div>
      <Card>
        <p className="text-sm text-slate-300">Generate slots by selecting a range and duration.</p>
        <SlotGenerator />
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Existing slots</p>
          <span className="text-xs text-slate-400">{slots.length} records</span>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-200">
          {slots.length === 0 && <p className="text-xs text-slate-500">No slots yet.</p>}
          {slots.map((slot: any) => (
            <div key={slot.id} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
              <p className="text-sm font-semibold text-white">
                {new Date(slot.start_at).toLocaleString()} - {new Date(slot.end_at).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">
                Capacity: {slot.capacity_workers} · Status:{' '}
                <span className="uppercase tracking-[0.2em] text-amber-300">{slot.status}</span>
              </p>
              {slot.jobs?.length ? (
                <p className="mt-2 text-xs text-slate-400">Booked job: {slot.jobs[0].address_text}</p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Open slot</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
