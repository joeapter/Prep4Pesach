import { cn } from '@/lib/utils';

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/40',
        className
      )}
    >
      {children}
    </div>
  );
}
