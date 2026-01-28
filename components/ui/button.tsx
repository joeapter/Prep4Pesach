import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const variantClasses = {
    default: 'bg-amber-300 text-slate-950 hover:bg-amber-200 focus-visible:outline-amber-400',
    ghost: 'bg-transparent text-slate-100 hover:text-white'
  };

  return (
    <button className={cn(base, variantClasses[variant], className)} {...props}>
      {props.children}
    </button>
  );
}
