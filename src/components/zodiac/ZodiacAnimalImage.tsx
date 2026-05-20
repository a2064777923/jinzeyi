import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ZodiacAnimalSlug } from './ZodiacAnimalIcon';

interface ZodiacAnimalImageProps {
  slug: string;
  label: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function ZodiacAnimalImage({
  slug,
  label,
  className,
  imageClassName,
  sizes = '96px',
  priority = false,
}: ZodiacAnimalImageProps) {
  const normalizedSlug = isZodiacAnimalSlug(slug) ? slug : 'rat';

  return (
    <span
      className={cn(
        'relative block aspect-square overflow-visible rounded-2xl border border-primary/12 bg-[#fff2d8] shadow-sm shadow-primary/8',
        className
      )}
    >
      <Image
        src={`/assets/image2/zodiac/${normalizedSlug}.png`}
        alt={label}
        fill
        className={cn('object-contain p-2', imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </span>
  );
}

function isZodiacAnimalSlug(value: string): value is ZodiacAnimalSlug {
  return [
    'rat',
    'ox',
    'tiger',
    'rabbit',
    'dragon',
    'snake',
    'horse',
    'goat',
    'monkey',
    'rooster',
    'dog',
    'pig',
  ].includes(value);
}
