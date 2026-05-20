import type { ReactNode, SVGProps } from 'react';
import { cn } from '@/lib/utils';

export type ZodiacAnimalSlug =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

interface ZodiacAnimalIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  slug: string;
  label: string;
  animal?: string;
}

const animalToSlug: Record<string, ZodiacAnimalSlug> = {
  鼠: 'rat',
  牛: 'ox',
  虎: 'tiger',
  兔: 'rabbit',
  龙: 'dragon',
  龍: 'dragon',
  蛇: 'snake',
  马: 'horse',
  馬: 'horse',
  羊: 'goat',
  猴: 'monkey',
  鸡: 'rooster',
  雞: 'rooster',
  狗: 'dog',
  猪: 'pig',
  豬: 'pig',
};

const fallbackAnimal: Record<ZodiacAnimalSlug, string> = {
  rat: '鼠',
  ox: '牛',
  tiger: '虎',
  rabbit: '兔',
  dragon: '龙',
  snake: '蛇',
  horse: '马',
  goat: '羊',
  monkey: '猴',
  rooster: '鸡',
  dog: '狗',
  pig: '猪',
};

const zodiacAccentColors: Record<ZodiacAnimalSlug, string> = {
  rat: '#047857',
  ox: '#9A5B12',
  tiger: '#C2410C',
  rabbit: '#0F766E',
  dragon: '#B7791F',
  snake: '#166534',
  horse: '#B91C1C',
  goat: '#A16207',
  monkey: '#D97706',
  rooster: '#475569',
  dog: '#7C2D12',
  pig: '#0E7490',
};

const zodiacBranches: Record<ZodiacAnimalSlug, string> = {
  rat: '子',
  ox: '丑',
  tiger: '寅',
  rabbit: '卯',
  dragon: '辰',
  snake: '巳',
  horse: '午',
  goat: '未',
  monkey: '申',
  rooster: '酉',
  dog: '戌',
  pig: '亥',
};

export function getZodiacSlugByAnimal(animal: string): ZodiacAnimalSlug {
  return animalToSlug[animal] ?? 'rat';
}

export function ZodiacAnimalIcon({ slug, label, animal, className, style, ...props }: ZodiacAnimalIconProps) {
  const normalizedSlug = isZodiacAnimalSlug(slug) ? slug : getZodiacSlugByAnimal(animal ?? '');
  const displayAnimal = animal ?? fallbackAnimal[normalizedSlug];

  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label={label}
      className={cn('zodiac-animal-icon size-12 text-primary', className)}
      style={{ color: zodiacAccentColors[normalizedSlug], ...style }}
      {...props}
    >
      <circle cx="48" cy="48" r="44" fill="currentColor" opacity="0.1" />
      <circle cx="48" cy="48" r="38" fill="var(--card)" opacity="0.96" />
      <circle cx="48" cy="48" r="35" fill="none" stroke="currentColor" strokeDasharray="3 5" strokeWidth="1.6" opacity="0.24" />
      <g className="zodiac-animal-icon__figure" opacity="0.26">
        {animalPaths[normalizedSlug]}
      </g>
      <text
        className="zodiac-animal-icon__seal-char"
        x="48"
        y="55"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fill="currentColor"
        fontFamily="var(--font-serif)"
      >
        {displayAnimal}
      </text>
      <text
        x="48"
        y="69"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="1"
        opacity="0.68"
        fontFamily="var(--font-serif)"
      >
        {zodiacBranches[normalizedSlug]}支
      </text>
      <g className="zodiac-animal-icon__branch">
        <circle cx="70" cy="70" r="13" fill="var(--background)" stroke="currentColor" strokeWidth="2" opacity="0.98" />
        <text
          x="70"
          y="75"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="currentColor"
          fontFamily="var(--font-serif)"
        >
          {zodiacBranches[normalizedSlug]}
        </text>
      </g>
    </svg>
  );
}

function isZodiacAnimalSlug(value: string): value is ZodiacAnimalSlug {
  return value in animalPaths;
}

const commonStroke = {
  stroke: 'currentColor',
  strokeWidth: 4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const;

const animalPaths: Record<ZodiacAnimalSlug, ReactNode> = {
  rat: (
    <g>
      <path d="M27 52c2-14 15-21 29-14 10 5 12 17 3 24-10 8-27 5-32-10Z" {...commonStroke} />
      <path d="M26 43c-6-4-10-1-10 4 0 7 10 7 13 2M39 35c-5-8 4-13 9-6M56 38c5-5 12-2 10 5" {...commonStroke} />
      <path d="M59 53h11M60 59h9M33 48h.1" {...commonStroke} />
    </g>
  ),
  ox: (
    <g>
      <path d="M29 40c5-11 33-11 38 0v15c0 10-8 17-19 17s-19-7-19-17V40Z" {...commonStroke} />
      <path d="M31 39c-9-10-16-9-19 1 6-1 12 1 17 6M65 39c9-10 16-9 19 1-6-1-12 1-17 6" {...commonStroke} />
      <path d="M39 54h.1M57 54h.1M43 63h10" {...commonStroke} />
    </g>
  ),
  tiger: (
    <g>
      <path d="M28 44c2-13 12-21 24-20 12 1 20 11 19 24-1 15-11 25-24 25-12 0-21-11-19-29Z" {...commonStroke} />
      <path d="M35 28l-7-9M62 29l8-8M43 34h12M40 42h17M36 51h23M44 59h8" {...commonStroke} />
      <path d="M40 48h.1M57 48h.1" {...commonStroke} />
    </g>
  ),
  rabbit: (
    <g>
      <path d="M34 45c-8-21-5-34 4-35 8 2 9 18 8 31M54 43c3-20 10-30 18-26 5 7-3 20-14 31" {...commonStroke} />
      <path d="M28 55c0-12 10-20 23-20s21 9 21 21c0 10-10 17-23 17s-21-8-21-18Z" {...commonStroke} />
      <path d="M42 53h.1M57 53h.1M46 62h7" {...commonStroke} />
    </g>
  ),
  dragon: (
    <g>
      <path d="M25 58c8-21 31-33 45-20 8 8 2 20-10 18-9-1-13-8-8-15" {...commonStroke} />
      <path d="M35 44c-5-8-12-9-18-4M54 30l-2-11M63 34l8-8M69 43l11-1M32 62l-8 9M45 56l-3 11M58 56l4 10" {...commonStroke} />
      <path d="M63 44h.1" {...commonStroke} />
    </g>
  ),
  snake: (
    <g>
      <path d="M28 64c8 9 31 8 37-1 7-10-4-16-18-17-14-1-24-6-20-15 4-11 29-13 37-2" {...commonStroke} />
      <path d="M61 29c8-4 14 1 14 8 0 8-8 12-16 8M63 37h.1M74 37l7-4" {...commonStroke} />
    </g>
  ),
  horse: (
    <g>
      <path d="M31 71V42c0-13 9-23 23-23 10 0 18 6 18 16 0 9-6 14-14 14H45" {...commonStroke} />
      <path d="M39 26c-6-2-12 1-15 8M53 20l-5-10M63 24l8-8M39 38h.1M35 53h23M35 62h16" {...commonStroke} />
    </g>
  ),
  goat: (
    <g>
      <path d="M30 48c0-13 9-22 22-22s21 9 21 22c0 14-9 24-22 24S30 62 30 48Z" {...commonStroke} />
      <path d="M34 33c-11-6-17 2-15 12 8 0 12-5 15-12ZM67 33c11-6 17 2 15 12-8 0-12-5-15-12Z" {...commonStroke} />
      <path d="M43 48h.1M58 48h.1M45 59c4 3 8 3 12 0M40 29c-4-11 7-17 13-8M63 29c5-11-6-17-13-8" {...commonStroke} />
    </g>
  ),
  monkey: (
    <g>
      <path d="M27 48c0-13 10-23 22-23s22 10 22 23c0 14-9 24-22 24S27 62 27 48Z" {...commonStroke} />
      <path d="M28 45c-11-5-16 5-11 12 6 4 12 0 12-8M70 45c11-5 16 5 11 12-6 4-12 0-12-8" {...commonStroke} />
      <path d="M40 47h.1M57 47h.1M41 59c6 4 11 4 17 0M39 33c6 4 14 4 20 0" {...commonStroke} />
    </g>
  ),
  rooster: (
    <g>
      <path d="M31 50c0-12 9-21 22-21 11 0 20 8 20 19 0 14-10 24-24 24-11 0-18-8-18-22Z" {...commonStroke} />
      <path d="M45 30c-1-13 12-16 14-4 5-8 16-4 12 6 9-1 11 10 2 13M31 50l-11-5M31 58l-12 4M54 48h.1" {...commonStroke} />
      <path d="M45 62h12" {...commonStroke} />
    </g>
  ),
  dog: (
    <g>
      <path d="M28 45c0-12 9-21 22-21s22 9 22 22c0 15-10 26-23 26S28 61 28 45Z" {...commonStroke} />
      <path d="M33 34c-11-2-15 9-9 18 8-2 11-9 9-18ZM66 34c11-2 15 9 9 18-8-2-11-9-9-18Z" {...commonStroke} />
      <path d="M42 48h.1M58 48h.1M46 58l4 4 5-4M34 66l-8 6M66 66l8 6" {...commonStroke} />
    </g>
  ),
  pig: (
    <g>
      <path d="M27 50c0-13 10-23 23-23s23 10 23 23c0 13-10 22-23 22S27 63 27 50Z" {...commonStroke} />
      <path d="M32 35c-8-7-15-2-13 8 6 0 11-3 13-8ZM68 35c8-7 15-2 13 8-6 0-11-3-13-8Z" {...commonStroke} />
      <path d="M40 48h.1M60 48h.1" {...commonStroke} />
      <rect x="40" y="55" width="20" height="11" rx="5" {...commonStroke} />
      <path d="M47 61h.1M53 61h.1" {...commonStroke} />
    </g>
  ),
};
