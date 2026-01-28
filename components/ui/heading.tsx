export function Heading({ level = 2, className, children }: React.PropsWithChildren<{ level?: 1 | 2 | 3 | 4; className?: string }>) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={`font-semibold tracking-tight text-slate-100 ${level === 1 ? 'text-4xl' : level === 2 ? 'text-3xl' : 'text-2xl'} ${className ?? ''}`}
    >
      {children}
    </Tag>
  );
}
