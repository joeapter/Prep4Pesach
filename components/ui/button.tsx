import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-sm',
    ghost: 'border-slate-200 text-slate-600 bg-white hover:border-slate-300 hover:text-slate-900'
  };

  return (
    <button className={cn(base, variantClasses[variant], className)} {...props}>
      {props.children}
    </button>
  );
}
