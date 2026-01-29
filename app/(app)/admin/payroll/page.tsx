import { Card } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type PayrollRow = {
  worker: string;
  hours: number;
  pay: number;
  balance: number;
};

export default async function AdminPayrollPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('time_entries')
    .select('minutes_worked, worker:workers(full_name, pay_rate_cents)')
    .eq('status', 'approved');
  const entries = data ?? [];

  const agg = new Map<string, PayrollRow>();

  entries.forEach((entry: any) => {
    const worker = entry.worker?.full_name ?? 'Worker';
    const rate = entry.worker?.pay_rate_cents ?? 0;
    const hours = (entry.minutes_worked ?? 0) / 60;
    const pay = (rate * hours) / 100;
    const existing = agg.get(worker) ?? { worker, hours: 0, pay: 0, balance: 0 };
    existing.hours += hours;
    existing.pay += pay;
    existing.balance += pay;
    agg.set(worker, existing);
  });

  const rows = Array.from(agg.values());

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Payroll</p>
        <h2 className="text-2xl font-semibold text-white">Pay runs & balances</h2>
      </div>
      <Card>
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Pay owed</th>
                <th className="px-4 py-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row) => (
                <tr key={row.worker}>
                  <td className="px-4 py-4 font-semibold text-white">{row.worker}</td>
                  <td className="px-4 py-4">{row.hours.toFixed(2)}</td>
                  <td className="px-4 py-4">{row.pay.toLocaleString('en-US', { style: 'currency', currency: 'ILS' })}</td>
                  <td className="px-4 py-4">{row.balance.toLocaleString('en-US', { style: 'currency', currency: 'ILS' })}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    No approved time entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
