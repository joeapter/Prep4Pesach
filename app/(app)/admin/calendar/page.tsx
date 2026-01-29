import CalendarView from '@/components/admin/calendar-view';
import { createServerClient } from '@/lib/supabase/server';
import { getAdminCalendar } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  const supabase = createServerClient();
  const slots = await getAdminCalendar(supabase);
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
