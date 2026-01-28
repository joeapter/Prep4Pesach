import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="space-y-4">
        <h2 className="text-4xl font-semibold text-white">Effortless Pesach cleaning in Ramat Beit Shemesh</h2>
        <p className="text-slate-300">
          Prep4Pesach gives clients, workers, and admins a single workspace to manage bookings, availability, time
          tracking, payroll, invoices, and payments.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Book Now</Button>
          <Button variant="ghost">Learn how it works</Button>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Clients',
            copy: 'Pick a slot, add job details, and get matched with a team.'
          },
          {
            title: 'Workers',
            copy: 'Publish availability, punch in/out, and see approved hours and pay.'
          },
          {
            title: 'Admins',
            copy: 'Generate slots, assign teams, approve hours, and send invoices.'
          }
        ].map((item) => (
          <Card key={item.title}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">{item.title}</p>
            <p className="mt-4 text-sm text-slate-300">{item.copy}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
