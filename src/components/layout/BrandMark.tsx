import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('block size-9 shrink-0', className)} aria-hidden="true">
      <svg
        className="size-full"
        viewBox="0 0 64 64"
        role="img"
        focusable="false"
      >
        <defs>
          <linearGradient id="brand-jade" x1="8" x2="58" y1="6" y2="58">
            <stop offset="0" stopColor="#10B981" />
            <stop offset="0.55" stopColor="#047857" />
            <stop offset="1" stopColor="#0F3D31" />
          </linearGradient>
          <linearGradient id="brand-gold" x1="16" x2="48" y1="8" y2="56">
            <stop offset="0" stopColor="#FDE68A" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#brand-jade)" />
        <circle cx="32" cy="32" r="23" fill="none" stroke="#ECFDF5" strokeOpacity="0.24" />
        <path
          d="M16 38c7-12 18-17 32-15-5 5-7 11-6 19-8-6-17-7-26-4Z"
          fill="url(#brand-gold)"
          opacity="0.92"
        />
        <path
          d="M19 44c9-5 18-5 27 0"
          fill="none"
          stroke="#FDE68A"
          strokeLinecap="round"
          strokeWidth="2.8"
          opacity="0.9"
        />
        <path
          d="M32 18v27M23 25h18M25 33h14M29 21c-1 8-3 15-8 22M35 22c2 7 5 13 9 20"
          fill="none"
          stroke="#FFFDF8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.1"
        />
      </svg>
    </span>
  );
}
