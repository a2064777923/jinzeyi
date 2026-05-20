import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AuspiciousRecommendationForm } from '@/components/jieri/AuspiciousRecommendationForm';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Image2HeroScene, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { getToolPage } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
  searchParams?: Promise<{ scene?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('jieri-recommend');
  if (!page) throw new Error('Missing jieri recommendation tool content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function JieriRecommendToolPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  setRequestLocale(locale);
  const page = getToolPage('jieri-recommend');
  if (!page) throw new Error('Missing jieri recommendation tool content');
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
          kicker={localizeBodyCopy(locale, '场景 · 参与者 · 日期范围')}
          imageSrc="/assets/image2/tools/jieri-recommend.png"
          imageAlt={localizeBodyCopy(locale, '新中式卡通推荐日期图示')}
          badges={[
            localizeBodyCopy(locale, '黄历基调'),
            localizeBodyCopy(locale, '事项匹配'),
            localizeBodyCopy(locale, '八字五行'),
            localizeBodyCopy(locale, '可用吉时'),
          ]}
          controls={
            <Image2HeroScene
              src="/assets/image2/tools/jieri-recommend.png"
              alt={localizeBodyCopy(locale, '新中式卡通择日推荐日历插画')}
              caption={localizeBodyCopy(locale, '推荐日期')}
              priority
            />
          }
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={localizeBodyCopy(locale, '推荐日期怎么排序')}
          deck={localizeBodyCopy(locale, '推荐结果会同时看事项、参与者、日期范围和吉时，再给出排序理由。')}
          steps={[
            {
              label: 'SCENE',
              title: localizeBodyCopy(locale, '选择事项'),
              body: localizeBodyCopy(locale, '先确定结婚、搬家、开业等场景，匹配不同宜项。'),
              iconSrc: '/assets/image2/tools/jieri-recommend.png',
              iconAlt: localizeBodyCopy(locale, '事项选择图示'),
            },
            {
              label: 'PEOPLE',
              title: localizeBodyCopy(locale, '参与者'),
              body: localizeBodyCopy(locale, '输入关键参与者资料，用于识别生肖冲煞和八字提示。'),
            },
            {
              label: 'RANGE',
              title: localizeBodyCopy(locale, '日期范围'),
              body: localizeBodyCopy(locale, '限定可执行窗口，避免给出无法安排的日期。'),
            },
            {
              label: 'RESULT',
              title: localizeBodyCopy(locale, '推荐理由'),
              body: localizeBodyCopy(locale, '每个候选日展示加分和降级原因，方便继续核对。'),
            },
          ]}
          className="mb-5"
        />
        <AuspiciousRecommendationForm locale={locale} initialScene={query.scene} />
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, page.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={page.faq} locale={locale} />
            <InternalLinkGrid links={page.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
