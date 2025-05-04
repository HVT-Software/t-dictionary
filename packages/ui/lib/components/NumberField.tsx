import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type NumberFieldProps = ComponentPropsWithoutRef<'input'>;

export const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return <input type="number" className={cn(className, 'input input-bordered w-full max-w-xs')} {...props} />;
};
