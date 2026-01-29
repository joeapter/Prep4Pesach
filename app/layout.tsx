import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Prep4Pesach',
  description: 'Pesach cleaning, bookings, availability, and payroll for Ramat Beit Shemesh',
  metadataBase: new URL('https://prep4pesach.com')
};

const navLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Book a cleaner', href: '/book' },
  { label: 'View availability', href: '/worker/availability' },
  { label: 'Contact us', href: '/contact' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f7f7] text-[#0f172a]">
        <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200">
              <Image src="/Prep4Pesach Logo.png" alt="Prep4Pesach logo" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-lg font-semibold tracking-[0.4em] text-slate-700">Prep4Pesach</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-slate-900">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <a href="/login" className="text-slate-600 hover:text-slate-900">
              Login
            </a>
            <a
              href="/signup"
              className="rounded-full border border-[#0047ba] px-4 py-2 text-[#0047ba] transition hover:bg-[#0047ba] hover:text-white"
            >
              Create account
            </a>
          </div>
        </header>
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
