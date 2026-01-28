import Link from 'next/link';

type SectionLink = { label: string; href: string };

const adminLinks: SectionLink[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/calendar', label: 'Calendar' },
  { href: '/admin/slots', label: 'Slots' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/time-entries', label: 'Time entries' },
  { href: '/admin/invoices', label: 'Invoices' },
  { href: '/admin/payroll', label: 'Payroll' }
];

export function AppShell({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-950 p-6 lg:p-12">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Prep4Pesach</p>
        <h1 className="text-3xl font-semibold text-white">{title ?? 'Workspace'}</h1>
        <p className="text-sm text-slate-400">Secure area for admins, workers, and clients.</p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
        <div className="space-y-6">{children}</div>
      </section>
    </div>
  );
}
