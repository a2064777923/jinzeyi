import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Image2HeroSceneProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

interface Image2IconTileProps {
  src: string;
  alt: string;
  label?: string;
  meta?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

interface MethodStep {
  label: string;
  title: string;
  body: string;
  iconSrc?: string;
  iconAlt?: string;
  detail?: ReactNode;
}

interface Image2MethodDiagramProps {
  title: string;
  deck?: string;
  steps: MethodStep[];
  className?: string;
}

export function Image2HeroScene({
  src,
  alt,
  caption,
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 340px',
}: Image2HeroSceneProps) {
  return (
    <div
      className={cn(
        'image2-showcase group relative overflow-hidden rounded-[1.35rem] border border-primary/15 bg-[linear-gradient(135deg,#fff8e9,#effaf2)] p-2 shadow-sm shadow-primary/10 sm:p-2.5',
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-accent/14 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-4 bottom-3 h-px bg-primary/12" aria-hidden="true" />
      <div className="relative aspect-[4/3] min-h-[11.5rem] overflow-visible rounded-[1rem] bg-[#fff2d8] sm:aspect-[6/5] sm:min-h-[15rem]">
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-contain p-3 transition duration-500 group-hover:scale-[1.025]',
            imageClassName
          )}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {caption ? (
        <p className="mt-2 text-center text-xs font-semibold tracking-[0.16em] text-primary/72">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export function Image2IconTile({
  src,
  alt,
  label,
  meta,
  className,
  imageClassName,
  sizes = '88px',
  priority = false,
}: Image2IconTileProps) {
  return (
    <span
      className={cn(
        'relative inline-grid aspect-square shrink-0 place-items-center overflow-visible rounded-2xl border border-primary/15 bg-[#fff2d8] shadow-sm shadow-primary/8',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn('object-contain p-2.5', imageClassName)}
        sizes={sizes}
        priority={priority}
      />
      {label ? (
        <span className="absolute bottom-1 left-1 right-1 rounded-full bg-background/86 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-primary shadow-sm">
          {label}
        </span>
      ) : null}
      {meta ? (
        <span className="sr-only">{meta}</span>
      ) : null}
    </span>
  );
}

export function Image2MethodDiagram({ title, deck, steps, className }: Image2MethodDiagramProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[1.25rem] border border-border bg-card p-5 shadow-sm sm:p-6',
        className
      )}
    >
      <div className="almanac-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="relative">
        <div className="max-w-3xl">
          <h2 className="font-serif-display text-2xl font-semibold text-foreground">{title}</h2>
          {deck ? <p className="mt-2 text-[0.95rem] leading-7 text-muted-foreground">{deck}</p> : null}
        </div>
        <div className={cn('mt-5 grid gap-3', steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4')}>
          {steps.map((step, index) => (
            <article
              key={`${step.label}-${step.title}`}
              className="group relative min-w-0 rounded-xl border border-border bg-background/82 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
            >
              {index < steps.length - 1 ? (
                <span className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden h-px w-6 bg-primary/35 md:block" aria-hidden="true" />
              ) : null}
              <div className="flex items-start gap-3">
                {step.iconSrc ? (
                  <Image2IconTile
                    src={step.iconSrc}
                    alt={step.iconAlt ?? step.title}
                    className="size-14 rounded-xl"
                    sizes="56px"
                    priority
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/15 bg-primary/10 font-serif-display text-lg font-semibold text-primary">
                    {index + 1}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-accent">{step.label}</p>
                  <h3 className="mt-1 text-base font-semibold leading-6 text-foreground">{step.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-[0.93rem] leading-6 text-muted-foreground">{step.body}</p>
              {step.detail ? <div className="mt-3">{step.detail}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Image2Showcase(props: Image2HeroSceneProps) {
  return <Image2HeroScene {...props} />;
}
