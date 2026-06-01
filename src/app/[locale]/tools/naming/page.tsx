import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SharePanel } from '@/components/share/SharePanel';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Image2HeroScene, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { NamingForm } from '@/components/tools/NamingForm';
import { getToolPage } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('naming');
  if (!page) throw new Error('Missing naming tool content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function NamingToolPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('naming');
  if (!page) throw new Error('Missing naming tool content');
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
          kicker={localizeBodyCopy(locale, '单字五行 · 基础评分 · 建议字')}
          imageSrc="/assets/image2/tools/naming.png"
          imageAlt={localizeBodyCopy(locale, '新中式卡通姓名五行图示')}
          badges={page.inputFields.map((field) => localizeBodyCopy(locale, field))}
          controls={
            <Image2HeroScene
              src="/assets/image2/tools/naming.png"
              alt={localizeBodyCopy(locale, '新中式卡通姓名五行名帖插画')}
              caption={localizeBodyCopy(locale, '姓名五行')}
              priority
            />
          }
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={localizeBodyCopy(locale, '姓名五行怎么拆')}
          deck={localizeBodyCopy(locale, '姓名工具先拆单字，再看五行分布和读音提示，最后给出可继续斟酌的建议。')}
          steps={[
            {
              label: 'NAME',
              title: localizeBodyCopy(locale, '输入姓名'),
              body: localizeBodyCopy(locale, '先把姓和名拆成单字，避免整段文字混算。'),
              iconSrc: '/assets/image2/tools/naming.png',
              iconAlt: localizeBodyCopy(locale, '输入姓名图示'),
            },
            {
              label: 'ELEMENT',
              title: localizeBodyCopy(locale, '单字五行'),
              body: localizeBodyCopy(locale, '每个字给出基础五行和可解释的参考理由。'),
            },
            {
              label: 'BALANCE',
              title: localizeBodyCopy(locale, '结构平衡'),
              body: localizeBodyCopy(locale, '看名字整体偏向，避免只追一个所谓喜用字。'),
            },
            {
              label: 'SUGGEST',
              title: localizeBodyCopy(locale, '建议方向'),
              body: localizeBodyCopy(locale, '输出的是命名参考，不替代家族语境和实际读写感。'),
            },
          ]}
          className="mb-5"
        />
        <NamingForm locale={locale} />
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
                title: localizeBodyCopy(locale, '分享姓名五行工具'),
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
