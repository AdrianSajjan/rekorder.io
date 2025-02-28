import { cn } from '@rekorder.io/utils';

interface HeadingProps extends React.ComponentPropsWithRef<'div'> {
  title: string;
  description: string;
}

export function Heading({ title, description, children, className, ...props }: HeadingProps) {
  return (
    <div className={cn('flex gap-4 justify-between items-center', className)} {...props}>
      <div className="space-y-px">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
