import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type TextFieldProps = ComponentPropsWithoutRef<'input'>;

export const TextField = ({ className, ...props }: TextFieldProps) => {
  return <input className={cn(className, 'input input-bordered w-full max-w-xs')} {...props} />;
};
