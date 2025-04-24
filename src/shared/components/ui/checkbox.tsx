import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded border pt-0.5 shadow-none shadow-sm transition-colors',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        'data-[state=unchecked]:bg-[#C3C3C3]',
        className
      )}
      {...props}
    >
      {/* 체크 여부와 관계없이 항상 아이콘 렌더링 */}
      <CheckIcon className={cn('size-3.5 stroke-[3] text-white')} />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
