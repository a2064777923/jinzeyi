import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { GlossaryPanel } from '@/components/knowledge/GlossaryPanel';
import { SharePanel } from '@/components/share/SharePanel';
import { Image2HeroScene, Image2IconTile, Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { Link } from '@/i18n/navigation';
import { getToolPage, toolPages } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { getGlossaryEntries } from '@/lib/content/glossary';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

const toolArt = {
  bazi: '/assets/image2/tools/bazi.png',
  naming: '/assets/image2/tools/naming.png',
  'jieri-recommend': '/assets/image2/tools/jieri-recommend.png',
} as const;

const toolMethodSteps = [
  {
    label: 'STEP 01',
    title: '输入资料',
    body: '把出生时间、姓名或择日场景先整理成结构化资料。',
    iconSrc: '/assets/image2/tools/bazi.png',
  },
  {
    label: 'STEP 02',
    title: '推算关系',
    body: '按四柱、五行、宜忌、冲煞和可用吉时拆开计算。',
    iconSrc: '/assets/image2/tools/naming.png',
  },
  {
    label: 'STEP 03',
    title: '输出结果',
    body: '结果区只保留可继续核对的字段、理由和下一步入口。',
    iconSrc: '/assets/image2/tools/jieri-recommend.png',
  },
] as const;

const toolMeta = {
  bazi: {
    input: '出生日期、时间、地点',
    output: '四柱、十神、五行强弱',
  },
  naming: {
    input: '姓名单字与读音',
    output: '五行提示与建议字',
  },
  'jieri-recommend': {
    input: '事项、参与者、日期范围',
    output: '推荐排序与风险提醒',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('tools-index');
  if (!page) throw new Error('Missing tools index content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function ToolsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('tools-index');
  if (!page) throw new Error('Missing tools index content');
  const seo = localizeSeo(locale, page.seo);
  const tools = toolPages.filter((item) =>
    item.toolKey === 'bazi' || item.toolKey === 'naming' || item.toolKey === 'jieri-recommend'
  );
  const jsonLd = buildPageJsonLd({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: page.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
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
          kicker={localizeBodyCopy(locale, '排盘 · 起名 · 查询')}
          imageSrc="/assets/image2/pages/tools-showcase.png"
          imageAlt={localizeBodyCopy(locale, '新中式卡通命理工具案台插画')}
          badges={page.inputFields.length === 0 ? ['八字排盘', '姓名五行'] : page.inputFields}
          controls={
            <Image2HeroScene
              src="/assets/image2/pages/tools-showcase.png"
              alt={localizeBodyCopy(locale, '新中式卡通排盘起名工具插画')}
              caption={localizeBodyCopy(locale, '排盘 · 起名 · 择日')}
              priority
            />
          }
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <Image2MethodDiagram
          title={localizeBodyCopy(locale, '工具怎么给出结果')}
          deck={localizeBodyCopy(locale, '资料进入正确入口后，传统字段会拆成可核对的理由，并在结果区继续比较。')}
          steps={toolMethodSteps.map((step) => ({
            ...step,
            title: localizeBodyCopy(locale, step.title),
            body: localizeBodyCopy(locale, step.body),
            iconAlt: localizeBodyCopy(locale, `${step.title}新中式卡通图示`),
          }))}
          className="mb-5"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => {
            const toolSeo = localizeSeo(locale, tool.seo);
            const art = toolArt[tool.toolKey as keyof typeof toolArt];
            const meta = toolMeta[tool.toolKey as keyof typeof toolMeta];
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className="image2-art-card group flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="flex items-start gap-3">
                  <Image2IconTile
                    src={art}
                    alt={localizeBodyCopy(locale, `${toolSeo.h1}新中式卡通图示`)}
                    className="size-20 rounded-2xl sm:size-24"
                    imageClassName="p-1 transition duration-300 group-hover:scale-105"
                    sizes="96px"
                    priority
                  />
                  <span className="min-w-0">
                    <span className="block text-xl font-semibold">{toolSeo.h1}</span>
                    <span className="mt-2 block text-sm leading-7 text-muted-foreground">{toolSeo.deck}</span>
                  </span>
                </span>
                <span className="grid gap-2 rounded-lg border border-border bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
                  <span>
                    <span className="font-semibold text-foreground">{localizeBodyCopy(locale, '输入')}：</span>
                    {localizeBodyCopy(locale, meta.input)}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{localizeBodyCopy(locale, '结果')}：</span>
                    {localizeBodyCopy(locale, meta.output)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {locale === 'zh-hant' ? '開始查詢' : '开始查询'}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </SeoPageBand>
      <SeoPageBand tone="muted">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              {localizeBodyCopy(locale, '工具用來整理下一步資料')}
            </h2>
            <p>{localizeBodyCopy(locale, page.body)}</p>
            <p className="mt-3">
              {localizeBodyCopy(locale, '八字排盤整理出生日期、時間、地點與性別，呈現四柱和五行分佈；姓名五行拆出單字五行與基礎建議。這些結果適合輔助理解，不適合作為單一決策依據。')}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FaqBlock items={page.faq} locale={locale} />
            <SharePanel
              title={seo.h1}
              text={seo.deck}
              url={`/${locale}/tools`}
              labels={{
                title: localizeBodyCopy(locale, '分享工具入口'),
                copyLink: localizeBodyCopy(locale, '複製連結'),
                copySummary: localizeBodyCopy(locale, '複製摘要'),
                copied: localizeBodyCopy(locale, '已複製'),
                nativeShare: localizeBodyCopy(locale, '系統分享'),
              }}
            />
            <InternalLinkGrid links={page.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <GlossaryPanel
          title={localizeBodyCopy(locale, '工具頁常見名詞')}
          intro={localizeBodyCopy(locale, '先理解四柱和五行，排盤結果才不會只剩幾個看不懂的字。')}
          entries={getGlossaryEntries(['fourPillars', 'fiveElements', 'ganZhi'], locale)}
        />
      </SeoPageBand>
    </SeoPageShell>
  );
}
