import Link from 'next/link';

type SectionLink = { label: string; href: string };

const adminLinks: SectionLink[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/slots', label: 'Slots' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/time-entries', label: 'Time entries' },
  { href: '/admin/invoices', label: 'Invoices' },
  { href: '/admin/payroll', label: 'Payroll' }
];

export function AppShell({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Prep4Pesach</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Admin</h1>
            <p className="mt-2 text-sm text-slate-500">Manage bookings, payroll, and invoices.</p>
          </div>
          <nav className="flex flex-col gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin console</p>
              <h2 className="text-3xl font-semibold text-slate-900">{title ?? 'Dashboard'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/slots"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm hover:border-slate-300"
              >
                Add slots
              </Link>
              <Link
                href="/admin/jobs"
                className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-sm hover:bg-slate-800"
              >
                New job
              </Link>
            </div>
          </div>
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
