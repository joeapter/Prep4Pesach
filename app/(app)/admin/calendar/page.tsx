import CalendarView from '@/components/admin/calendar-view';
import { requireAdmin } from '@/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  const { supabaseService } = await requireAdmin();
  const { data: slots } = await supabaseService
    .from('slots')
    .select('id, start_at, end_at, jobs(address_text)')
    .order('start_at', { ascending: true });
  const events = (slots ?? []).map((slot: any) => ({
    id: slot.id,
    title: slot.jobs?.map((job: any) => job.address_text).join(', ') ?? 'Open slot',
    start: slot.start_at,
    end: slot.end_at
  }));

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Admin calendar</p>
        <h2 className="text-2xl font-semibold text-white">Slots + job schedule</h2>
      </div>
      <CalendarView events={events} />
    </section>
  );
}
