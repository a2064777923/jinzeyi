import type { MetadataRoute } from 'next';
import { getIndexedYearRange } from '@/lib/almanac/year-support';
import { getSitemapCandidates, jieriScenes } from '@/lib/content/registry';
import { SITE_ORIGIN } from '@/lib/seo';

type Locale = 'zh-hant' | 'zh-hans';

interface Props {
  params: Promise<{ locale: Locale }>;
}

function normalizePath(path: string): string {
  if (path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_ORIGIN}/${locale}${normalizePath(path)}`;
}

function alternatesFor(path: string) {
  return {
    languages: {
      'zh-Hans': absoluteUrl('zh-hans', path),
      'zh-Hant': absoluteUrl('zh-hant', path),
      'x-default': absoluteUrl('zh-hant', path),
    },
  };
}

function sitemapEntry(locale: Locale, path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(locale, path),
    lastModified: new Date('2026-05-17T00:00:00.000Z'),
    changeFrequency: 'weekly',
    priority,
    alternates: alternatesFor(path),
  };
}

export default async function sitemap(input?: Props): Promise<MetadataRoute.Sitemap> {
  const { locale } = input ? await input.params : { locale: 'zh-hant' as const };
  const entries = getSitemapCandidates().map((route) => sitemapEntry(locale, route.path, route.path === '/' ? 1 : 0.7));
  const { start, end } = getIndexedYearRange();

  for (const scene of jieriScenes) {
    for (let year = start; year <= end; year += 1) {
      entries.push(sitemapEntry(locale, `/jieri/${scene.slug}/${year}`, 0.65));
    }
  }

  return entries;
}
