import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/seo/ArticleLayout';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { getZodiacArticle, zodiacArticles } from '@/lib/content/zodiac';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans'; animal: string; slug: string }>;
}

export function generateStaticParams() {
  return zodiacArticles.map((article) => ({
    animal: article.animalSlug,
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, animal, slug } = await params;
  setRequestLocale(locale);
  const article = getZodiacArticle(animal, slug);

  if (!article) {
    return buildSeoPageMetadata({
      locale,
      path: `/zodiac/${animal}/${slug}`,
      title: locale === 'zh-hant' ? '生肖文章｜今擇易' : '生肖文章｜今择易',
      description: locale === 'zh-hant' ? '生肖文章。' : '生肖文章。',
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

export default async function ZodiacArticlePage({ params }: Props) {
  const { locale, animal, slug } = await params;
  setRequestLocale(locale);
  const article = getZodiacArticle(animal, slug);
  if (!article) notFound();

  const seo = localizeSeo(locale, article.seo);
  const breadcrumbs = [
    { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
    { name: locale === 'zh-hant' ? '生肖' : '生肖', href: '/zodiac' },
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
        <ArticleLayout
          title={seo.h1}
          deck={seo.deck}
          faq={article.faq}
          relatedLinks={article.relatedLinks}
          rail={
            <div className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
              <p className="font-semibold text-foreground">{localizeBodyCopy(locale, '资料参考')}</p>
              <ul className="mt-2 list-disc pl-5">
                {article.sourceNotes.map((note) => (
                  <li key={note}>{localizeBodyCopy(locale, note)}</li>
                ))}
              </ul>
            </div>
          }
        >
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph}>{localizeBodyCopy(locale, paragraph)}</p>
          ))}
        </ArticleLayout>
      </SeoPageBand>
    </SeoPageShell>
  );
}

