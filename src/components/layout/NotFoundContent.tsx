'use client';

import { CalendarDays, Home, SearchX } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const copy = {
  'zh-hans': {
    title: '找不到这一页',
    body: '这个地址不存在，或日期格式不正确。可以返回首页，或继续打开月历。',
    home: '返回首页',
    calendar: '打开月历',
  },
  'zh-hant': {
    title: '找不到這一頁',
    body: '這個地址不存在，或日期格式不正確。可以返回首頁，或繼續打開月曆。',
    home: '返回首頁',
    calendar: '打開月曆',
  },
} as const;

function getLocaleFromPath(): keyof typeof copy {
  if (typeof window === 'undefined') return 'zh-hant';
  return window.location.pathname.startsWith('/zh-hans') ? 'zh-hans' : 'zh-hant';
}

export function NotFoundContent() {
  const locale = getLocaleFromPath();
  const t = copy[locale];
  const homeHref = `/${locale}`;
  const calendarHref = `/${locale}/calendar`;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-xl rounded-lg border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto grid size-14 place-items-center rounded-lg border border-ominous/25 bg-ominous/10 text-ominous">
          <SearchX className="size-7" aria-hidden="true" />
        </div>
        <p className="mt-5 font-serif-display text-5xl font-semibold text-foreground">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          {t.body}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={homeHref}
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'cursor-pointer')}
          >
            <Home className="size-4" aria-hidden="true" />
            {t.home}
          </a>
          <a
            href={calendarHref}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'cursor-pointer')}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            {t.calendar}
          </a>
        </div>
      </section>
    </main>
  );
}
