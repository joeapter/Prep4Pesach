import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { getClientJobs } from '@/lib/supabase/queries';

const formatDate = (slot?: { start_at: string; end_at: string }) => {
  if (!slot) return 'TBD';
  const start = new Date(slot.start_at);
  const end = new Date(slot.end_at);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })}-${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
};

export default async function ClientJobsPage() {
  const supabase = createServerClient();
  const jobs = await getClientJobs(supabase);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Client</p>
        <h2 className="text-2xl font-semibold text-white">Your bookings</h2>
      </div>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{job.address_text}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{formatDate(job.slot)}</p>
              </div>
              <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-amber-200">{job.status}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">Hourly rate: ₪{(job.hourly_rate_cents / 100).toFixed(2)}</p>
          </Card>
        ))}
        {jobs.length === 0 && <p className="text-sm text-slate-500">You don’t have any bookings yet.</p>}
      </div>
    </section>
  );
}
