import { describe, expect, it } from 'vitest';
import {
  SITE_ORIGIN,
  buildDefinedTermSetJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildOrganizationJsonLd,
  buildPageJsonLd,
  buildSeoPageMetadata,
  buildWebApplicationJsonLd,
  buildWebPageJsonLd,
  buildAlmanacJsonLd,
  buildLocalizedMetadata,
  buildWebsiteJsonLd,
} from '@/lib/seo';
import { getRouteByPath } from '@/lib/content/registry';

describe('Phase 3 SEO helpers', () => {
  it('preserves existing metadata and JSON-LD exports', () => {
    expect(typeof buildLocalizedMetadata).toBe('function');
    expect(typeof buildWebsiteJsonLd).toBe('function');
    expect(typeof buildAlmanacJsonLd).toBe('function');
  });

  it('builds localized page metadata with canonical, alternates, keywords, and Content-Language', () => {
    const metadata = buildSeoPageMetadata({
      locale: 'zh-hans',
      path: '/tools/bazi',
      title: '八字排盘',
      description: '四柱五行基础查询',
      keywords: ['八字排盘', '四柱'],
    });

    expect(metadata.alternates?.canonical).toBe('/zh-hans/tools/bazi');
    expect(metadata.alternates?.languages).toMatchObject({
      'zh-Hans': '/zh-hans/tools/bazi',
      'zh-Hant': '/zh-hant/tools/bazi',
      'x-default': '/zh-hant/tools/bazi',
    });
    expect(metadata.other?.['content-language']).toBe('zh-Hans');
    expect(metadata.keywords).toEqual(expect.arrayContaining(['八字排盘', '四柱', '黄历']));
  });

  it('uses Traditional Content-Language for zh-hant pages', () => {
    const metadata = buildSeoPageMetadata({
      locale: 'zh-hant',
      path: '/jieri',
      title: '黃道吉日查詢',
      description: '按場景查詢吉日',
    });

    expect(metadata.other?.['content-language']).toBe('zh-Hant');
  });

  it('builds FAQPage JSON-LD from visible FAQ content', () => {
    const route = getRouteByPath('/jieri');
    expect(route).toBeDefined();

    const jsonLd = buildFaqJsonLd({
      locale: 'zh-hans',
      faq: route!.faq,
    });

    expect(jsonLd['@type']).toBe('FAQPage');
    expect(jsonLd.mainEntity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'Question',
          name: route!.faq[0].question,
        }),
      ]),
    );
  });

  it('builds BreadcrumbList JSON-LD with absolute localized URLs', () => {
    const jsonLd = buildBreadcrumbJsonLd({
      locale: 'zh-hant',
      items: [
        { name: '首頁', href: '/' },
        { name: '八字排盤', href: '/tools/bazi' },
      ],
    });

    expect(jsonLd['@type']).toBe('BreadcrumbList');
    expect(jsonLd.itemListElement).toEqual([
      expect.objectContaining({ position: 1, item: `${SITE_ORIGIN}/zh-hant` }),
      expect.objectContaining({ position: 2, item: `${SITE_ORIGIN}/zh-hant/tools/bazi` }),
    ]);
  });

  it('builds Article, WebApplication, and WebPage JSON-LD shapes', () => {
    const article = buildArticleJsonLd({
      locale: 'zh-hans',
      path: '/zodiac/rat/personality',
      title: '属鼠性格',
      description: '属鼠性格与择日参考',
    });
    const app = buildWebApplicationJsonLd({
      locale: 'zh-hans',
      path: '/tools/naming',
      title: '姓名五行查询',
      description: '姓名五行基础分析',
    });
    const page = buildWebPageJsonLd({
      locale: 'zh-hans',
      path: '/zodiac',
      title: '十二生肖查询',
      description: '生肖年份性格配对',
    });

    expect(article).toMatchObject({ '@type': 'Article', headline: '属鼠性格' });
    expect(app).toMatchObject({ '@type': 'WebApplication', operatingSystem: 'Web' });
    expect(page).toMatchObject({ '@type': 'WebPage', name: '十二生肖查询' });
  });

  it('builds Organization, ItemList, and DefinedTermSet JSON-LD shapes', () => {
    const organization = buildOrganizationJsonLd('zh-hans');
    const itemList = buildItemListJsonLd({
      locale: 'zh-hans',
      path: '/tools',
      title: '命理工具',
      description: '工具入口',
      items: [
        { name: '八字排盘', description: '四柱查询', path: '/tools/bazi' },
        { name: '姓名五行', description: '名字五行查询', path: '/tools/naming' },
      ],
    });
    const termSet = buildDefinedTermSetJsonLd({
      locale: 'zh-hans',
      path: '/zodiac',
      title: '十二生肖',
      description: '生肖条目',
      terms: [
        { name: '鼠', alternateName: ['子鼠'], description: '十二生肖鼠', path: '/zodiac/rat' },
      ],
    });

    expect(organization).toMatchObject({ '@type': 'Organization', url: SITE_ORIGIN });
    expect(itemList).toMatchObject({ '@type': 'ItemList', itemListElement: expect.arrayContaining([expect.objectContaining({ position: 1 })]) });
    expect(termSet).toMatchObject({ '@type': 'DefinedTermSet', hasDefinedTerm: expect.arrayContaining([expect.objectContaining({ '@type': 'DefinedTerm' })]) });
  });

  it('returns page-family JSON-LD arrays without duplicating assembly in routes', () => {
    const route = getRouteByPath('/tools/bazi');
    expect(route).toBeDefined();

    const jsonLd = buildPageJsonLd({
      locale: 'zh-hans',
      path: route!.path,
      title: route!.seo.zhHans.title,
      description: route!.seo.zhHans.description,
      pageType: 'WebApplication',
      faq: route!.faq,
      breadcrumbs: [
        { name: '首页', href: '/' },
        { name: route!.seo.zhHans.h1, href: route!.path },
      ],
    });

    expect(jsonLd.map((item) => item['@type'])).toEqual([
      'WebApplication',
      'FAQPage',
      'BreadcrumbList',
    ]);
  });
});
