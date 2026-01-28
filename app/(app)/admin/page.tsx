import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { getOpenSlots, getWorkerTimeEntries } from '@/lib/supabase/queries';

export default async function AdminDashboardPage() {
  const supabase = createServerClient();
  const [slots, timeEntries, invoices] = await Promise.all([
    getOpenSlots(supabase),
    getWorkerTimeEntries(supabase),
    supabase.from('invoices').select('*')
  ]);

  const pendingEntries = timeEntries.filter((entry) => entry.status === 'pending').length;
  const outstandingInvoices = invoices.data?.filter((invoice) => invoice.status === 'draft' || invoice.status === 'sent').length ?? 0;

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
