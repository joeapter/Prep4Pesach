import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { getWorkerAssignedJobs } from '@/lib/supabase/queries';

function formatSlot(slot?: { start_at: string; end_at: string }) {
  if (!slot) return 'TBD';
  const start = new Date(slot.start_at);
  const end = new Date(slot.end_at);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })}-${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export default async function WorkerJobsPage() {
  const supabase = createServerClient();
  const assignments = await getWorkerAssignedJobs(supabase);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Worker hub</p>
        <h2 className="text-2xl font-semibold text-white">Your assigned jobs</h2>
      </div>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <div className="flex flex-col gap-3 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{assignment.job?.clients?.full_name ?? 'Client'}</p>
                <p>{assignment.job?.address_text}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{formatSlot(assignment.job?.slot)}</p>
              </div>
              <div className="flex gap-2">
                <Button>Start shift</Button>
                <Button variant="ghost">End shift</Button>
              </div>
            </div>
            <p className="text-xs text-slate-500">Status: {assignment.job?.status ?? 'Booked'}</p>
          </Card>
        ))}
        {assignments.length === 0 && <p className="text-sm text-slate-500">No assignments yet.</p>}
      </div>
    </section>
  );
}
