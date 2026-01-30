import CalendarView from '@/components/admin/calendar-view';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { supabaseService } = await requireAdmin();
  const [{ data: openSlotsData }, { data: jobsData }, { data: workersData }, { data: invoicesData }] =
    await Promise.all([
      supabaseService.from('slots').select('id, start_at, end_at, status').eq('status', 'open'),
      supabaseService
        .from('jobs')
        .select(
          'id, address_text, status, hourly_rate_cents, requested_team_size, slot(start_at, end_at), clients(full_name), job_assignments(worker_id)'
        )
        .order('created_at', { ascending: false }),
      supabaseService
        .from('workers')
        .select('id, pay_rate_cents, active, profile:profiles(full_name, phone)')
        .eq('active', true),
      supabaseService.from('invoices').select('id, status')
    ]);

  const openSlots = openSlotsData ?? [];
  const jobs = jobsData ?? [];
  const workers = workersData ?? [];
  const invoices = invoicesData ?? [];

  const toHours = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return diff > 0 ? diff / (1000 * 60 * 60) : 0;
  };

  const totalHoursAvailable = openSlots.reduce((sum, slot: any) => sum + toHours(slot.start_at, slot.end_at), 0);
  const activeJobStatuses = new Set(['booked', 'scheduled', 'in_progress', 'completed']);
  const bookedJobs = jobs.filter((job: any) => activeJobStatuses.has(job.status));
  const bookedHours = bookedJobs.reduce((sum: number, job: any) => {
    const slot = Array.isArray(job.slot) ? job.slot[0] ?? null : job.slot;
    return sum + toHours(slot?.start_at, slot?.end_at);
  }, 0);

  const estimatedRevenue = bookedJobs.reduce((sum: number, job: any) => {
    const slot = Array.isArray(job.slot) ? job.slot[0] ?? null : job.slot;
    const hours = toHours(slot?.start_at, slot?.end_at);
    const teamSize = job.requested_team_size ?? 1;
    return sum + (job.hourly_rate_cents ?? 0) * hours * teamSize;
  }, 0);

  const avgWorkerRate =
    workers.length > 0
      ? workers.reduce((sum: number, worker: any) => sum + (worker.pay_rate_cents ?? 0), 0) / workers.length
      : 0;
  const avgTeamSize =
    bookedJobs.length > 0
      ? bookedJobs.reduce((sum: number, job: any) => sum + (job.requested_team_size ?? 1), 0) / bookedJobs.length
      : 1;
  const estimatedLabor = bookedHours * avgWorkerRate * avgTeamSize;
  const estimatedProfit = estimatedRevenue - estimatedLabor;

  const outstandingInvoices = invoices.filter(
    (invoice: any) => invoice.status === 'draft' || invoice.status === 'sent'
  ).length;

  const now = Date.now();
  const upcomingJobs = jobs
    .map((job: any) => {
      const slot = Array.isArray(job.slot) ? job.slot[0] ?? null : job.slot;
      return { ...job, slot };
    })
    .filter((job: any) => job.slot?.start_at && new Date(job.slot.start_at).getTime() >= now)
    .slice(0, 6);

  const calendarEvents = jobs
    .map((job: any) => {
      const slot = Array.isArray(job.slot) ? job.slot[0] ?? null : job.slot;
      if (!slot?.start_at || !slot?.end_at) return null;
      return {
        id: job.id,
        title: job.address_text ?? 'Booked job',
        start: slot.start_at,
        end: slot.end_at
      };
    })
    .filter(Boolean);

  const cards = [
    {
      title: 'Hours available',
      value: totalHoursAvailable.toFixed(1),
      detail: 'Open slots ready for booking.'
    },
    {
      title: 'Booked hours',
      value: bookedHours.toFixed(1),
      detail: 'Estimated from scheduled jobs.'
    },
    {
      title: 'Estimated profit',
      value: `₪${(estimatedProfit / 100).toFixed(0)}`,
      detail: 'Revenue minus estimated labor.'
    },
    {
      title: 'Outstanding invoices',
      value: outstandingInvoices.toString(),
      detail: 'Draft + sent invoices.'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-slate-200/80">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Schedule</p>
              <h3 className="text-xl font-semibold text-slate-900">Calendar overview</h3>
            </div>
            <a className="text-sm font-semibold text-slate-600 hover:text-slate-900" href="/admin/calendar">
              Full calendar →
            </a>
          </div>
          <CalendarView events={calendarEvents as any[]} />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upcoming jobs</p>
            <h3 className="text-xl font-semibold text-slate-900">Next on the roster</h3>
          </div>
          <div className="space-y-3">
            {upcomingJobs.map((job: any) => (
              <Card key={job.id} className="border-slate-200/80">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{job.address_text}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {job.clients?.full_name ?? 'Client'} ·{' '}
                    {job.slot?.start_at ? new Date(job.slot.start_at).toLocaleString() : 'TBD'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Team size: {job.requested_team_size ?? 1}</span>
                    <a className="text-slate-600 hover:text-slate-900" href="/admin/jobs">
                      Assign workers →
                    </a>
                  </div>
                </div>
              </Card>
            ))}
            {upcomingJobs.length === 0 && (
              <Card className="border-slate-200/80">
                <p className="text-sm text-slate-500">No upcoming jobs yet.</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workers</p>
              <h3 className="text-lg font-semibold text-slate-900">Available to assign</h3>
            </div>
            <Button variant="ghost" className="text-xs">
              View all
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workers.map((worker: any) => {
              const profile = Array.isArray(worker.profile) ? worker.profile[0] ?? null : worker.profile;
              const phone = profile?.phone ?? '';
              const digits = phone ? phone.replace(/\D/g, '') : '';
              const waLink = digits
                ? `https://wa.me/${digits}?text=${encodeURIComponent('Prep4Pesach schedule: please confirm your availability.')}`
                : null;
              return (
                <div key={worker.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{profile?.full_name ?? 'Worker'}</p>
                  <p className="text-xs text-slate-500">
                    ₪{((worker.pay_rate_cents ?? 0) / 100).toFixed(2)} / hour
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{phone || 'Phone missing'}</span>
                    {waLink ? (
                      <a className="rounded-full bg-emerald-500 px-3 py-1 font-semibold text-white" href={waLink} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-500">WhatsApp</span>
                    )}
                  </div>
                </div>
              );
            })}
            {workers.length === 0 && <p className="text-sm text-slate-500">No active workers yet.</p>}
          </div>
        </Card>

        <Card className="border-slate-200/80">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Manual updates</h3>
          <p className="mt-2 text-sm text-slate-500">
            Add new jobs, open slots, or update availability from one place.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href="/admin/slots">
              Add availability & slots
            </a>
            <a className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href="/admin/jobs">
              Create or edit jobs
            </a>
            <a className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href="/admin/invoices">
              Generate invoices
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}
