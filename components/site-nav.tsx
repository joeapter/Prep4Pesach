import Link from 'next/link';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/book', label: 'Book' },
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Sign up' }
];

export function SiteNav({ className }: { className?: string }) {
  return (
    <nav className={cn('flex gap-4 text-sm font-medium text-slate-200', className)}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="transition hover:text-white">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
