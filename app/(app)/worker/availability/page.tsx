import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { getWorkerAvailability } from '@/lib/supabase/queries';

function formatRange(start: string, end: string) {
  const startAt = new Date(start);
  const endAt = new Date(end);
  return `${startAt.toLocaleString('default', { weekday: 'short', day: 'numeric' })} · ${startAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })}-${endAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export default async function WorkerAvailabilityPage() {
  const supabase = createServerClient();
  const availability = await getWorkerAvailability(supabase);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Worker</p>
        <h2 className="text-2xl font-semibold text-white">Submit availability</h2>
      </div>
      <Card>
        <p className="text-sm text-slate-300">
          Add your time blocks (start/end) and the admin will use them when generating slots. Each block can have an
          optional recurring rule.
        </p>
        <div className="mt-4 space-y-2">
          {availability.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 px-4 py-3 text-sm text-slate-200"
            >
              <span>{formatRange(block.start_at, block.end_at)}</span>
              {block.recurring_rule && <span className="text-xs text-amber-300">{block.recurring_rule}</span>}
            </div>
          ))}
          {availability.length === 0 && <p className="text-sm text-slate-500">No availability blocks yet.</p>}
        </div>
      </Card>
      <Card>
        <p className="text-sm text-white">Next step:</p>
        <p className="text-sm text-slate-400">
          Once the admin uses your availability to generate slots, you will see assignments in the Worker Job hub and be
          able to punch in/out.
        </p>
      </Card>
    </section>
  );
}
