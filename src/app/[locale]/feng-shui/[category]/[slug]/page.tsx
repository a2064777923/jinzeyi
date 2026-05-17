import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { FengShuiArticle } from '@/components/feng-shui/FengShuiArticle';
import { fengShuiArticles, getFengShuiArticle, getFengShuiCategory } from '@/lib/content/feng-shui';
import { localizeSeo } from '@/lib/content/localize';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans'; category: string; slug: string }>;
}

export function generateStaticParams() {
  return fengShuiArticles.map((article) => ({
    category: article.categorySlug,
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  const article = getFengShuiArticle(category, slug);

  if (!article) {
    return buildSeoPageMetadata({
      locale,
      path: `/feng-shui/${category}/${slug}`,
      title: locale === 'zh-hant' ? '風水文章｜今擇易' : '风水文章｜今择易',
      description: locale === 'zh-hant' ? '風水文章。' : '风水文章。',
    });
  }

  const seo = localizeSeo(locale, article.seo);
  return buildSeoPageMetadata({
    locale,
    path: article.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function FengShuiArticlePage({ params }: Props) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  const article = getFengShuiArticle(category, slug);
  const categoryMeta = getFengShuiCategory(category);
  if (!article || !categoryMeta) notFound();

  const seo = localizeSeo(locale, article.seo);
  const breadcrumbs = [
    { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
    { name: locale === 'zh-hant' ? '風水' : '风水', href: '/feng-shui' },
    { name: seo.h1, href: article.path },
  ];
  const jsonLd = [
    buildArticleJsonLd({
      locale,
      path: article.path,
      title: seo.title,
      description: seo.description,
      authorName: article.authorName,
    }),
    buildFaqJsonLd({ locale, faq: article.faq }),
    buildBreadcrumbJsonLd({ locale, items: breadcrumbs }),
  ];

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <SeoPageBand>
        <FengShuiArticle article={article} locale={locale} />
      </SeoPageBand>
    </SeoPageShell>
  );
}
