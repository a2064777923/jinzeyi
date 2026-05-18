import type { ReactNode } from 'react';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SharePanel } from '@/components/share/SharePanel';
import type { FaqItem, InternalLink, LocaleCode } from '@/lib/content/types';
import { localizeBodyCopy } from '@/lib/content/localize';
import { cn } from '@/lib/utils';

interface ArticleLayoutProps {
  title: string;
  deck: string;
  children: ReactNode;
  faq?: FaqItem[];
  relatedLinks?: InternalLink[];
  locale?: LocaleCode;
  shareUrl?: string;
  shareLabel?: string;
  rail?: ReactNode;
  className?: string;
}

export function ArticleLayout({
  title,
  deck,
  children,
  faq = [],
  relatedLinks = [],
  locale,
  shareUrl,
  shareLabel,
  rail,
  className,
}: ArticleLayoutProps) {
  const copy = (value: string) => (locale ? localizeBodyCopy(locale, value) : value);

  return (
    <article className={cn('grid min-w-0 gap-8 lg:grid-cols-[minmax(0,65ch)_minmax(18rem,1fr)] lg:items-start', className)}>
      <div className="min-w-0 max-w-[65ch]">
        <header className="mb-6 flex flex-col gap-3">
          <h1 className="font-serif-display text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">{deck}</p>
        </header>
        <div className="flex flex-col gap-6 text-[17px] leading-[1.9] text-foreground">
          {children}
        </div>
        {faq.length > 0 && <FaqBlock items={faq} locale={locale} className="mt-8" />}
        {relatedLinks.length > 0 && <InternalLinkGrid links={relatedLinks} locale={locale} className="mt-8 lg:hidden" />}
      </div>
      <aside className="min-w-0 lg:sticky lg:top-24">
        <div className="flex flex-col gap-5">
          {rail}
          {shareUrl ? (
            <SharePanel
              title={title}
              text={deck}
              url={shareUrl}
              labels={{
                title: shareLabel ?? copy('分享这篇文章'),
                copyLink: copy('复制链接'),
                copySummary: copy('复制摘要'),
                copied: copy('已复制'),
                nativeShare: copy('系统分享'),
              }}
            />
          ) : null}
          {relatedLinks.length > 0 && <InternalLinkGrid links={relatedLinks} locale={locale} className="hidden lg:flex" />}
        </div>
      </aside>
    </article>
  );
}
