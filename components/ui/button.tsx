import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#0047ba] text-white border-transparent hover:bg-[#00329a]',
    ghost: 'border-[#0047ba] text-[#0047ba] bg-white hover:bg-[#f0f4ff]'
  };

  return (
    <button className={cn(base, variantClasses[variant], className)} {...props}>
      {props.children}
    </button>
  );
}
