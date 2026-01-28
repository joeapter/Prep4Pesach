import { SiteNav } from '@/components/site-nav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Prep4Pesach</p>
          <h1 className="text-3xl font-semibold lg:text-4xl">Pesach Cleaning with clarity</h1>
          <p className="mt-2 text-sm text-slate-300">Book a slot, coordinate workers, and automate payroll.</p>
        </div>
        <SiteNav />
      </header>
      <main>{children}</main>
    </div>
  );
}
