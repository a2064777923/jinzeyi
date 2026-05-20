import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BaziForm } from '@/components/tools/BaziForm';
import { GlossaryPanel } from '@/components/knowledge/GlossaryPanel';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SharePanel } from '@/components/share/SharePanel';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Image2HeroScene, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { getToolPage } from '@/lib/content/tools';
import { getGlossaryEntries } from '@/lib/content/glossary';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('bazi');
  if (!page) throw new Error('Missing bazi tool content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function BaziToolPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('bazi');
  if (!page) throw new Error('Missing bazi tool content');
  const seo = localizeSeo(locale, page.seo);
  const jsonLd = buildPageJsonLd({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebApplication',
    faq: page.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: locale === 'zh-hant' ? '工具' : '工具', href: '/tools' },
      { name: seo.h1, href: page.path },
    ],
  });

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={localizeBodyCopy(locale, '四柱 · 日主 · 十神 · 藏干')}
          imageSrc="/assets/image2/tools/bazi.png"
          imageAlt={localizeBodyCopy(locale, '新中式卡通八字排盘图示')}
          badges={[
            localizeBodyCopy(locale, '真太阳时'),
            localizeBodyCopy(locale, '纳音'),
            localizeBodyCopy(locale, '五行强弱'),
          ]}
          controls={
            <Image2HeroScene
              src="/assets/image2/tools/bazi.png"
              alt={localizeBodyCopy(locale, '新中式卡通四柱命盘插画')}
              caption={localizeBodyCopy(locale, '四柱命盘')}
              priority
            />
          }
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={localizeBodyCopy(locale, '八字排盘怎么读')}
          deck={localizeBodyCopy(locale, '先校正出生资料，再排出四柱，最后看日主、十神和五行强弱。')}
          steps={[
            {
              label: 'INPUT',
              title: localizeBodyCopy(locale, '出生资料'),
              body: localizeBodyCopy(locale, '日期、时间、城市和性别用于建立基础盘面。'),
              iconSrc: '/assets/image2/tools/bazi.png',
              iconAlt: localizeBodyCopy(locale, '出生资料图示'),
            },
            {
              label: 'TIME',
              title: localizeBodyCopy(locale, '真太阳时'),
              body: localizeBodyCopy(locale, '先按城市经度校正时间，再进入干支推算。'),
            },
            {
              label: 'CHART',
              title: localizeBodyCopy(locale, '四柱命盘'),
              body: localizeBodyCopy(locale, '年、月、日、时四柱同时展示天干、地支和藏干。'),
            },
            {
              label: 'READ',
              title: localizeBodyCopy(locale, '结果解释'),
              body: localizeBodyCopy(locale, '用日主、十神、纳音和五行强弱辅助阅读，不直接断事。'),
            },
          ]}
          className="mb-5"
        />
        <BaziForm locale={locale} />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <GlossaryPanel
          title={localizeBodyCopy(locale, '盘面关键词')}
          intro={localizeBodyCopy(locale, '日主、十神、藏干和纳音会出现在盘面字段旁，提示里有简短解释。')}
          entries={getGlossaryEntries(['dayMaster', 'tenGods', 'hiddenStems', 'naYin', 'fiveElements'], locale)}
        />
      </SeoPageBand>
      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, page.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={page.faq} locale={locale} />
            <SharePanel
              title={seo.h1}
              text={seo.deck}
              url={`/${locale}${page.path}`}
              labels={{
                title: localizeBodyCopy(locale, '分享八字排盘'),
                copyLink: localizeBodyCopy(locale, '复制链接'),
                copySummary: localizeBodyCopy(locale, '复制摘要'),
                copied: localizeBodyCopy(locale, '已复制'),
                nativeShare: localizeBodyCopy(locale, '系统分享'),
              }}
            />
            <InternalLinkGrid links={page.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
