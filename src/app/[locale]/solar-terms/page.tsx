import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSolarTerms } from '@/lib/almanac/service';
import Image from 'next/image';
import { CalendarDays, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SolarTermsList } from '@/components/almanac/SolarTermsList';
import { SolarOrbit } from '@/components/almanac/SolarOrbit';
import { SharePanel } from '@/components/share/SharePanel';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { buildFaqJsonLd, buildLocalizedMetadata } from '@/lib/seo';
import { coreIndexablePages } from '@/lib/content/registry';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('SolarTerms');
  const year = new Date().getFullYear();
  return buildLocalizedMetadata({
    locale,
    path: '/solar-terms',
    title: `${t('title')} - ${year}`,
    description: `${year}${t('dateYear')}${t('title')}日期表，按春夏秋冬整理二十四節氣、節令含義與傳統習俗，搭配黃曆與農曆查詢使用。`,
  });
}

export default async function SolarTermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('SolarTerms');
  const currentYear = new Date().getFullYear();
  const termsContent = coreIndexablePages.find((page) => page.id === 'solar-terms');
  if (!termsContent) throw new Error('Missing solar terms content registry');

  let terms;
  let error: string | null = null;

  try {
    terms = await getSolarTerms(currentYear);
  } catch {
    error = 'fetch-error';
  }

  if (error || !terms) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {t('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd({ locale, faq: termsContent.faq })),
        }}
      />
      <section className="mx-auto grid max-w-[82rem] items-center gap-6 overflow-hidden rounded-[1.5rem] border border-border/80 bg-card/85 p-5 shadow-sm sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CalendarDays className="size-3" aria-hidden="true" />
              {currentYear}{t('dateYear')}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="size-3" aria-hidden="true" />
              {t('countLabel', { count: terms.length })}
            </Badge>
          </div>
          <div className="space-y-3">
            <h1 className="font-serif-display text-3xl font-semibold tracking-normal text-primary sm:text-4xl">
              {t('title')}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t('description')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <HeroMetric value="4" label={t('seasonCountLabel')} />
            <HeroMetric value="12" label={t('jieCountLabel')} />
            <HeroMetric value="12" label={t('qiCountLabel')} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem] lg:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="relative min-h-[16rem] overflow-hidden rounded-[1.25rem] border border-primary/15 bg-[#fff2d8] shadow-sm">
            <Image
              src="/assets/image2/solar-terms/qingming.png"
              alt="新中式卡通风二十四节气主视觉，踏青、柳枝与春日山水"
              fill
              priority
              loading="eager"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 470px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 text-primary-foreground">
              <p className="text-xs font-semibold tracking-[0.2em]">SOLAR TERMS</p>
              <p className="mt-1 text-sm leading-6 text-primary-foreground/88">
                {t('heroVisualCaption')}
              </p>
            </div>
          </div>
          <SolarOrbit className="hidden max-w-none sm:block" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[82rem]">
        <SolarTermsList terms={terms} />
      </div>

      <section className="mx-auto w-full max-w-[82rem]">
        <SharePanel
          title={`${currentYear}${t('dateYear')}${t('title')}`}
          text={t('description')}
          url={`/${locale}/solar-terms`}
          labels={{
            title: locale === 'zh-hant' ? '分享節氣表' : '分享节气表',
            copyLink: locale === 'zh-hant' ? '複製連結' : '复制链接',
            copySummary: locale === 'zh-hant' ? '複製摘要' : '复制摘要',
            copied: locale === 'zh-hant' ? '已複製' : '已复制',
            nativeShare: locale === 'zh-hant' ? '系統分享' : '系统分享',
          }}
        />
      </section>

      <section className="mx-auto grid w-full max-w-[82rem] gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <FaqBlock items={termsContent.faq} locale={locale} />
        <InternalLinkGrid links={termsContent.relatedLinks} locale={locale} />
      </section>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="shimmer-panel rounded-lg border border-border/80 bg-background/75 p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
