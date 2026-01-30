import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InvoiceGenerator } from '@/components/admin/invoice-generator';
import { TimeEntryApprovals } from '@/components/admin/time-entry-approvals';
import { requireAdmin } from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminJobsPage() {
  const { supabaseService } = await requireAdmin();
  const { data: jobData } = await supabaseService
    .from('jobs')
    .select('id, address_text, status, hourly_rate_cents, slot(*), clients(full_name)')
    .order('created_at', { ascending: false });
  const jobs = jobData ?? [];
  const { data: pendingEntriesData = [] } = await supabaseService
    .from('time_entries')
    .select('id, job_id, minutes_worked, punch_in, status, worker:workers(full_name)')
    .eq('status', 'pending')
    .order('punch_in', { ascending: false });
  const pendingEntries =
    (pendingEntriesData ?? []).map((entry: any) => ({
      ...entry,
      worker: Array.isArray(entry.worker) ? entry.worker[0] ?? null : entry.worker
    })) ?? [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Jobs</p>
        <h2 className="text-2xl font-semibold text-white">Assign workers & approve hours</h2>
      </div>
      <div className="space-y-4">
        {jobs.map((job: any) => (
          <Card key={job.id}>
            <div className="flex flex-col gap-2 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{job.clients?.full_name ?? 'Client'}</p>
                <p>{job.address_text}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Rate: ₪{(job.hourly_rate_cents / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button>Assign worker</Button>
                <Button variant="ghost">Review time entries</Button>
                <InvoiceGenerator jobId={job.id} />
              </div>
            </div>
            <p className="text-xs text-slate-500">Status: {job.status}</p>
          </Card>
        ))}
        {jobs.length === 0 && <p className="text-sm text-slate-500">No jobs yet.</p>}
      </div>
      <TimeEntryApprovals entries={pendingEntries} />
    </section>
  );
}
