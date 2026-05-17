import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPageJsonLd,
  buildWebApplicationJsonLd,
  buildWebPageJsonLd,
} from '@/lib/seo';
import {
  fengShuiArticles,
  getRouteByPath,
  getZodiacArticlesForAnimal,
  getZodiacProfile,
} from '@/lib/content/registry';

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Phase 3 structured data coverage', () => {
  it('builds WebPage, WebApplication, Article, FAQPage, and BreadcrumbList JSON-LD', () => {
    const zodiacHub = getZodiacProfile('rat')!;
    const zodiacArticle = getZodiacArticlesForAnimal('rat')[0];
    const fengShuiArticle = fengShuiArticles[0];
    const bazi = getRouteByPath('/tools/bazi')!;

    expect(buildWebPageJsonLd({
      locale: 'zh-hans',
      path: zodiacHub.path,
      title: zodiacHub.seo.zhHans.title,
      description: zodiacHub.seo.zhHans.description,
    })).toMatchObject({ '@type': 'WebPage', inLanguage: 'zh-Hans' });

    expect(buildWebApplicationJsonLd({
      locale: 'zh-hans',
      path: bazi.path,
      title: bazi.seo.zhHans.title,
      description: bazi.seo.zhHans.description,
    })).toMatchObject({ '@type': 'WebApplication', operatingSystem: 'Web' });

    expect(buildArticleJsonLd({
      locale: 'zh-hans',
      path: zodiacArticle.path,
      title: zodiacArticle.seo.zhHans.title,
      description: zodiacArticle.seo.zhHans.description,
      authorName: zodiacArticle.authorName,
    })).toMatchObject({ '@type': 'Article', headline: zodiacArticle.seo.zhHans.title });

    expect(buildArticleJsonLd({
      locale: 'zh-hans',
      path: fengShuiArticle.path,
      title: fengShuiArticle.seo.zhHans.title,
      description: fengShuiArticle.seo.zhHans.description,
      authorName: fengShuiArticle.authorName,
    })).toMatchObject({ '@type': 'Article', headline: fengShuiArticle.seo.zhHans.title });

    expect(buildFaqJsonLd({ locale: 'zh-hans', faq: bazi.faq })).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: expect.arrayContaining([expect.objectContaining({ '@type': 'Question' })]),
    });

    expect(buildBreadcrumbJsonLd({
      locale: 'zh-hans',
      items: [
        { name: '首页', href: '/' },
        { name: '八字排盘', href: '/tools/bazi' },
      ],
    })).toMatchObject({ '@type': 'BreadcrumbList' });
  });

  it('buildPageJsonLd produces expected page type bundles', () => {
    const bazi = getRouteByPath('/tools/bazi')!;
    const jsonLd = buildPageJsonLd({
      locale: 'zh-hans',
      path: bazi.path,
      title: bazi.seo.zhHans.title,
      description: bazi.seo.zhHans.description,
      pageType: 'WebApplication',
      faq: bazi.faq,
      breadcrumbs: [{ name: '首页', href: '/' }, { name: '八字排盘', href: bazi.path }],
    });

    expect(jsonLd.map((item) => item['@type'])).toEqual(['WebApplication', 'FAQPage', 'BreadcrumbList']);
  });

  it('route files import centralized JSON-LD helpers', () => {
    const files = [
      'src/app/[locale]/jieri/[scene]/[year]/page.tsx',
      'src/app/[locale]/zodiac/[animal]/page.tsx',
      'src/app/[locale]/zodiac/[animal]/[slug]/page.tsx',
      'src/app/[locale]/tools/bazi/page.tsx',
      'src/app/[locale]/tools/naming/page.tsx',
      'src/app/[locale]/feng-shui/[category]/[slug]/page.tsx',
    ];

    for (const file of files) {
      const text = source(file);
      expect(text, file).toContain('@/lib/seo');
      expect(text, file).toMatch(/build(Page|Article|Faq|Breadcrumb|WebApplication|WebPage)JsonLd/);
    }
  });
});
