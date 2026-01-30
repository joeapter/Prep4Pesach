import { Card } from '@/components/ui/card';
import { requireAdmin } from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { supabaseService } = await requireAdmin();
  const [{ data: slotsData }, { data: timeEntriesData }, { data: invoicesData }] = await Promise.all([
    supabaseService.from('slots').select('id').eq('status', 'open'),
    supabaseService.from('time_entries').select('id, status'),
    supabaseService.from('invoices').select('id, status')
  ]);

  const slots = slotsData ?? [];
  const timeEntries = timeEntriesData ?? [];
  const invoices = invoicesData ?? [];

  const pendingEntries = timeEntries.filter((entry: any) => entry.status === 'pending').length;
  const outstandingInvoices = invoices.filter(
    (invoice: any) => invoice.status === 'draft' || invoice.status === 'sent'
  ).length;

  const cards = [
    {
      title: 'Open slots',
      value: slots.length.toString(),
      detail: 'Generate more slots from worker availability.'
    },
    {
      title: 'Pending time entries',
      value: pendingEntries.toString(),
      detail: 'Approve entries before invoicing.'
    },
    {
      title: 'Outstanding invoices',
      value: outstandingInvoices.toString(),
      detail: 'Send invoice emails after attaching PDFs.'
    }
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin dashboard</p>
        <h2 className="text-2xl font-semibold text-white">Operations at a glance</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{card.title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
