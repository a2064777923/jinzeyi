import Image from 'next/image';
import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('relative block size-9 shrink-0 overflow-hidden rounded-xl bg-background shadow-sm shadow-primary/20', className)} aria-hidden="true">
      <Image src="/assets/image2/site-icon.png" alt="" fill className="object-contain p-0.5" sizes="36px" priority />
    </span>
  );
}
