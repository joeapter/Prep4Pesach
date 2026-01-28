import { Card } from '@/components/ui/card';
import { TimeEntryApprovals } from '@/components/admin/time-entry-approvals';
import { createServerClient } from '@/lib/supabase/server';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

export default async function AdminTimeEntriesPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const statusFilter = Array.isArray(searchParams?.status) ? searchParams.status[0] : searchParams?.status;
  const workerFilter = Array.isArray(searchParams?.worker) ? searchParams.worker[0] : searchParams?.worker;
  const supabase = createServerClient();
  const { data: entries = [] } = await supabase
    .from('time_entries')
    .select(
      'id, punch_in, punch_out, minutes_worked, status, job:jobs(address_text, slot(start_at, end_at)), worker:workers(id, full_name)'
    )
    .order('punch_in', { ascending: false });

  const { data: workers = [] } = await supabase.from('workers').select('id, full_name').order('full_name');

  const filteredEntries = entries.filter((entry) => {
    if (statusFilter && entry.status !== statusFilter) return false;
    if (workerFilter && entry.worker?.id !== workerFilter) return false;
    return true;
  });

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Time entries</p>
        <h2 className="text-2xl font-semibold text-white">Details & approvals</h2>
        <p className="text-sm text-slate-400">
          Filter by status or worker to narrow down the list before approving entries.
        </p>
      </div>
      <Card>
        <form className="grid gap-4 md:grid-cols-2" method="get" action="/admin/time-entries">
          <label className="text-xs text-slate-400">
            <span className="font-semibold text-white">Status</span>
            <select
              name="status"
              defaultValue={statusFilter ?? ''}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-400">
            <span className="font-semibold text-white">Worker</span>
            <select
              name="worker"
              defaultValue={workerFilter ?? ''}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white"
            >
              <option value="">All workers</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.full_name}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Card>
      <Card>
        <p role="status" aria-live="polite" className="text-xs text-slate-400">
          Showing {filteredEntries.length} of {entries.length} entries matched.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Minutes</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredEntries.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>
                    No entries matched the filter. Try clearing the form or adding new time entries.
                  </td>
                </tr>
              )}
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 font-semibold text-white">{entry.worker?.full_name ?? 'Worker'}</td>
                  <td className="px-4 py-3">{entry.job?.address_text ?? 'Address TBD'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {entry.job?.slot?.start_at
                      ? `${new Date(entry.job.slot.start_at).toLocaleString()} - ${new Date(entry.job.slot.end_at).toLocaleString()}`
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3">{entry.minutes_worked ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-800/70 px-2 py-1 text-xs uppercase tracking-[0.2em]">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <TimeEntryApprovals entries={filteredEntries.filter((entry) => entry.status === 'pending')} />
    </section>
  );
}
