import type { MetadataRoute } from 'next';
import { getIndexedYearRange } from '@/lib/almanac/year-support';
import { getSitemapCandidates, jieriScenes } from '@/lib/content/registry';
import { SITE_ORIGIN } from '@/lib/seo';

type Locale = 'zh-hant' | 'zh-hans';

const locales: Locale[] = ['zh-hant', 'zh-hans'];
const SITEMAP_LAST_MODIFIED = new Date('2026-05-21T00:00:00.000Z');

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
    lastModified: SITEMAP_LAST_MODIFIED,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority,
    alternates: alternatesFor(path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const { start, end } = getIndexedYearRange();

  for (const locale of locales) {
    for (const route of getSitemapCandidates()) {
      entries.push(sitemapEntry(locale, route.path, route.path === '/' ? 1 : 0.7));
    }

    for (const scene of jieriScenes) {
      for (let year = start; year <= end; year += 1) {
        entries.push(sitemapEntry(locale, `/jieri/${scene.slug}/${year}`, 0.65));
      }
    }
  }

  return entries;
}
