import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { Image2HeroScene, Image2IconTile, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { Link } from '@/i18n/navigation';
import { jieriIndexPage, jieriScenes } from '@/lib/content/jieri-scenes';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

const jieriMethodSteps = [
  {
    label: 'SCENE',
    title: '先定场景',
    body: '结婚、搬家、开业和出行要看的宜项不同，不能只看红色日期。',
    iconSrc: '/assets/image2/pages/jieri-showcase.png',
  },
  {
    label: 'MATCH',
    title: '宜忌匹配',
    body: '把场景关键词和当天宜忌交叉，先筛出真正命中事项的日子。',
    iconSrc: '/assets/image2/almanac-yi.png',
  },
  {
    label: 'CAUTION',
    title: '冲煞提醒',
    body: '遇到凶日、冲关键生肖或场景忌项时，提醒多小心、多留意。',
    iconSrc: '/assets/image2/direction-conflict.png',
  },
  {
    label: 'LIST',
    title: '年度清单',
    body: '按月份输出候选日，再进入每日黄历核对吉时和方位。',
    iconSrc: '/assets/image2/tools/jieri-recommend.png',
  },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, jieriIndexPage.seo);

  return buildSeoPageMetadata({
    locale,
    path: jieriIndexPage.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function JieriIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations('Layout');
  const seo = localizeSeo(locale, jieriIndexPage.seo);
  const currentYear = getCurrentYear();
  const jsonLd = buildPageJsonLd({
    locale,
    path: jieriIndexPage.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebApplication',
    faq: jieriIndexPage.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: seo.h1, href: jieriIndexPage.path },
    ],
  });

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={locale === 'zh-hant' ? '場景擇日' : '场景择日'}
          imageSrc="/assets/image2/pages/jieri-showcase.png"
          imageAlt={locale === 'zh-hant' ? '新中式卡通黃道吉日插畫' : '新中式卡通黄道吉日插画'}
          badges={[`${currentYear}`, locale === 'zh-hant' ? '宜忌匹配' : '宜忌匹配', locale === 'zh-hant' ? '凶日降級' : '凶日降级']}
          shareUrl={`/${locale}/jieri`}
          shareLabel={locale === 'zh-hant' ? '分享吉日查詢' : '分享吉日查询'}
          shareMode="compact"
          controls={
            <Image2HeroScene
              src="/assets/image2/pages/jieri-showcase.png"
              alt={locale === 'zh-hant' ? '新中式卡通擇日案台插畫' : '新中式卡通择日案台插画'}
              caption={locale === 'zh-hant' ? '場景擇日' : '场景择日'}
              priority
            />
          }
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={locale === 'zh-hant' ? '吉日矩陣怎麼篩' : '吉日矩阵怎么筛'}
          deck={localizeBodyCopy(locale, '按场景、宜忌、冲煞和年度清单逐层收窄，最后再挑真正合用的日期。')}
          steps={jieriMethodSteps.map((step) => ({
            ...step,
            title: localizeBodyCopy(locale, step.title),
            body: localizeBodyCopy(locale, step.body),
            iconAlt: localizeBodyCopy(locale, `${step.title}新中式卡通图示`),
          }))}
          className="mb-5"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-anime="tiles">
          {jieriScenes.map((scene) => (
            <Link
              key={scene.slug}
              href={`/jieri/${scene.slug}/${currentYear}`}
              data-anime-tile
              data-anime-hover
              className="image2-art-card group flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="flex items-start gap-3">
                <Image2IconTile
                  src={scene.icon}
                  alt={localizeBodyCopy(locale, `${scene.name}吉日圖示`)}
                  className="size-20"
                  imageClassName="p-1 transition duration-300 group-hover:scale-105"
                  sizes="80px"
                />
                <span className="min-w-0">
                  <span className="block text-lg font-semibold">{scene.name}吉日</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {localizeBodyCopy(locale, scene.summary)}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {scene.yiTerms.map((term) => (
                  <Badge key={term} variant="outline">{localizeBodyCopy(locale, term)}</Badge>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {currentYear}{locale === 'zh-hant' ? '年吉日' : '年吉日'}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{locale === 'zh-hant' ? '如何使用吉日矩陣' : '如何使用吉日矩阵'}</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {localizeBodyCopy(locale, jieriIndexPage.body)}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FaqBlock items={jieriIndexPage.faq} locale={locale} />
            <InternalLinkGrid links={jieriIndexPage.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
