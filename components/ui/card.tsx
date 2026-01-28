import { cn } from '@/lib/utils';

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/30', className)}>{children}</div>;
}
