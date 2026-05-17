import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ZodiacHub } from '@/components/zodiac/ZodiacHub';
import { getZodiacArticlesForAnimal, getZodiacProfile, zodiacAnimals } from '@/lib/content/zodiac';
import { localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans'; animal: string }>;
}

export function generateStaticParams() {
  return zodiacAnimals.map((animal) => ({ animal: animal.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, animal } = await params;
  setRequestLocale(locale);
  const profile = getZodiacProfile(animal);

  if (!profile) {
    return buildSeoPageMetadata({
      locale,
      path: `/zodiac/${animal}`,
      title: locale === 'zh-hant' ? '生肖查詢｜今擇易' : '生肖查询｜今择易',
      description: locale === 'zh-hant' ? '查詢生肖資料。' : '查询生肖资料。',
    });
  }

  const seo = localizeSeo(locale, profile.seo);
  return buildSeoPageMetadata({
    locale,
    path: profile.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function ZodiacAnimalPage({ params }: Props) {
  const { locale, animal } = await params;
  setRequestLocale(locale);
  const profile = getZodiacProfile(animal);
  if (!profile) notFound();

  const seo = localizeSeo(locale, profile.seo);
  const articles = getZodiacArticlesForAnimal(profile.slug);
  const jsonLd = buildPageJsonLd({
    locale,
    path: profile.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: profile.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: locale === 'zh-hant' ? '生肖' : '生肖', href: '/zodiac' },
      { name: seo.h1, href: profile.path },
    ],
  });

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <ZodiacHub locale={locale} profile={profile} articles={articles} />
    </>
  );
}

