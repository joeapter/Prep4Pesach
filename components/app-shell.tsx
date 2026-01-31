import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/admin/signout-button';

type SectionLink = { label: string; href: string };

const adminLinks: SectionLink[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/slots', label: 'Slots' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/time-entries', label: 'Time entries' },
  { href: '/admin/invoices', label: 'Invoices' },
  { href: '/admin/payroll', label: 'Payroll' }
];

export async function AppShell({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return (
    <div className="admin-theme min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-6 px-6 py-6">
        <aside className="hidden w-72 shrink-0 flex-col justify-between rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm lg:flex">
          <div className="space-y-8">
            <div>
              <img src="/Prep4Pesach Logo.png" alt="Prep4Pesach" className="h-10 w-auto" />
            </div>
            <nav className="flex flex-col gap-1 text-sm font-medium">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in as</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.email ?? 'admin@prep4pesach.com'}</p>
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin dashboard</p>
            <h2 className="text-3xl font-semibold text-slate-900">{title ?? 'Dashboard'}</h2>
            <p className="mt-2 text-sm text-slate-500">Store performance and operational insights.</p>
          </div>
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
