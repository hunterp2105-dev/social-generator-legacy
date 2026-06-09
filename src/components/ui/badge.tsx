import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-amber-100 text-amber-800',
        secondary: 'bg-stone-100 text-stone-600',
        rose: 'bg-rose-100 text-rose-700',
        outline: 'border border-stone-200 text-stone-600',
        tiktok: 'bg-black text-white',
        instagram: 'bg-gradient-to-r from-pink-500 to-orange-400 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
