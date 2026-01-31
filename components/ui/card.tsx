import { cn } from '@/lib/utils';

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}
