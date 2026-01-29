import { Button } from '@/components/ui/button';
import { BookSlotForm } from '@/components/client/book-slot-form';
import { createServerClient } from '@/lib/supabase/server';
import { getOpenSlots } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

function formatSlot(slot: { start_at: string; end_at: string }) {
  const start = new Date(slot.start_at);
  const end = new Date(slot.end_at);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export default async function BookPage() {
  const supabase = createServerClient();
  const slots = await getOpenSlots(supabase);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 text-slate-100">
      <h2 className="text-3xl font-semibold">Book a slot</h2>
      <p className="text-sm text-slate-400">
        Browse open slots, select your desired team size, and submit your job details. The admin will confirm availability
        and invoice you once the job is complete.
      </p>
      <div className="flex flex-col gap-4">
        {slots.map((slot: any) => (
          <div key={slot.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm text-amber-300">{formatSlot(slot)}</p>
            <p className="text-xs text-slate-500">Capacity: {slot.capacity_workers} workers</p>
            <BookSlotForm slot={slot} />
          </div>
        ))}
        {slots.length === 0 && <p className="text-sm text-slate-500">No open slots available yet.</p>}
      </div>
    </div>
  );
}
