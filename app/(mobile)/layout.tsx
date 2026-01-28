export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-4 py-5 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-amber-400">Prep4Pesach Mobile</p>
        <h1 className="text-2xl font-semibold text-white">Worker punch-in</h1>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  );
}
