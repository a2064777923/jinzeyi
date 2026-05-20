import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JieriScenePage } from '@/components/jieri/JieriScenePage';
import { getAuspiciousDaysForScene } from '@/lib/almanac/auspicious';
import { getIndexedYearRange, isLegalRouteYear } from '@/lib/almanac/year-support';
import { getJieriScene, jieriScenes } from '@/lib/content/jieri-scenes';
import { localizeBodyCopy } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans'; scene: string; year: string }>;
  searchParams?: Promise<{ zodiac?: string }>;
}

function parseRouteYear(year: string): number | null {
  if (!/^\d+$/.test(year)) return null;
  const parsed = Number(year);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function buildSceneTitle(sceneName: string, year: number, locale: 'zh-hant' | 'zh-hans'): string {
  const title = `${year}年${sceneName}吉日`;
  return locale === 'zh-hant' ? localizeBodyCopy(locale, title) : title;
}

export function generateStaticParams() {
  const { start, end } = getIndexedYearRange();
  const params: Array<{ scene: string; year: string }> = [];

  for (const scene of jieriScenes) {
    for (let year = start; year <= end; year += 1) {
      params.push({ scene: scene.slug, year: String(year) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, scene: sceneSlug, year: yearParam } = await params;
  setRequestLocale(locale);
  const year = parseRouteYear(yearParam);
  const scene = getJieriScene(sceneSlug);

  if (!scene || year === null || !isLegalRouteYear(year)) {
    return buildSeoPageMetadata({
      locale,
      path: `/jieri/${sceneSlug}/${yearParam}`,
      title: locale === 'zh-hant' ? '吉日查詢｜今擇易' : '吉日查询｜今择易',
      description: locale === 'zh-hant' ? '查詢黃道吉日。' : '查询黄道吉日。',
    });
  }

  const title = `${buildSceneTitle(scene.name, year, locale)}｜今择易`;
  const description = localizeBodyCopy(
    locale,
    `${year}年${scene.name}吉日查询，按${scene.yiTerms.join('、')}等宜项筛选，保留凶日降级提示，并显示冲煞、生肖避冲和推荐理由。`,
  );

  return buildSeoPageMetadata({
    locale,
    path: `/jieri/${scene.slug}/${year}`,
    title: localizeBodyCopy(locale, title),
    description,
    keywords: [`${scene.name}吉日`, `${year}年吉日`, '黄道吉日', '择日'],
  });
}

export default async function JieriYearPage({ params, searchParams }: Props) {
  const { locale, scene: sceneSlug, year: yearParam } = await params;
  setRequestLocale(locale);
  const year = parseRouteYear(yearParam);
  const scene = getJieriScene(sceneSlug);
  const query = searchParams ? await searchParams : {};
  const zodiac = query.zodiac;

  if (!scene || year === null || !isLegalRouteYear(year)) {
    notFound();
  }

  const results = await getAuspiciousDaysForScene({ scene, year, zodiac });
  const title = buildSceneTitle(scene.name, year, locale);
  const description = localizeBodyCopy(
    locale,
    `${title}按宜项、吉凶、冲煞和生肖条件整理，适合筛出年度备选日期，再打开每日黄历核对时辰。`,
  );
  const faq = [
    {
      id: `${scene.slug}-annual-method`,
      question: localizeBodyCopy(locale, `${year}年${scene.name}吉日怎么筛选？`),
      answer: localizeBodyCopy(locale, `黄历宜项「${scene.yiTerms.join('、')}」、当日吉凶、冲煞和生肖避冲会一起参与判断，凶日会保留但降级提示。`),
    },
    {
      id: `${scene.slug}-caution`,
      question: localizeBodyCopy(locale, '为什么有些日子会标为谨慎？'),
      answer: localizeBodyCopy(locale, '因为这些日子虽命中场景宜项，但可能同时出现凶日、生肖相冲或场景相关忌项，更适合作为备选。'),
    },
  ];

  const jsonLd = buildPageJsonLd({
    locale,
    path: `/jieri/${scene.slug}/${year}`,
    title,
    description,
    pageType: 'WebApplication',
    faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: locale === 'zh-hant' ? '吉日' : '吉日', href: '/jieri' },
      { name: title, href: `/jieri/${scene.slug}/${year}` },
    ],
  });

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <JieriScenePage
        locale={locale}
        year={year}
        scene={scene}
        results={results}
        zodiac={zodiac}
        faq={faq}
      />
    </>
  );
}
