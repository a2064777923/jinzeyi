import { describe, expect, it } from 'vitest';
import { buildSeoPageMetadata } from '@/lib/seo';
import {
  fengShuiArticles,
  getJieriScene,
  getRouteByPath,
  getZodiacArticlesForAnimal,
  getZodiacProfile,
} from '@/lib/content/registry';

const representativeRoutes = [
  { family: 'jieri', path: '/jieri/jiehun/2026', title: '2026年结婚吉日', description: '结婚吉日查询', keywords: ['结婚吉日'] },
  { family: 'zodiac', path: getZodiacProfile('rat')!.path, title: getZodiacProfile('rat')!.seo.zhHans.title, description: getZodiacProfile('rat')!.seo.zhHans.description, keywords: getZodiacProfile('rat')!.seo.zhHans.keywords },
  { family: 'zodiac article', path: getZodiacArticlesForAnimal('rat')[0].path, title: getZodiacArticlesForAnimal('rat')[0].seo.zhHans.title, description: getZodiacArticlesForAnimal('rat')[0].seo.zhHans.description, keywords: getZodiacArticlesForAnimal('rat')[0].seo.zhHans.keywords },
  { family: 'bazi', path: getRouteByPath('/tools/bazi')!.path, title: getRouteByPath('/tools/bazi')!.seo.zhHans.title, description: getRouteByPath('/tools/bazi')!.seo.zhHans.description, keywords: getRouteByPath('/tools/bazi')!.seo.zhHans.keywords },
  { family: 'naming', path: getRouteByPath('/tools/naming')!.path, title: getRouteByPath('/tools/naming')!.seo.zhHans.title, description: getRouteByPath('/tools/naming')!.seo.zhHans.description, keywords: getRouteByPath('/tools/naming')!.seo.zhHans.keywords },
  { family: 'feng-shui', path: fengShuiArticles[0].path, title: fengShuiArticles[0].seo.zhHans.title, description: fengShuiArticles[0].seo.zhHans.description, keywords: fengShuiArticles[0].seo.zhHans.keywords },
];

describe('Phase 3 metadata coverage', () => {
  it('has representative route families for metadata checks', () => {
    expect(getJieriScene('jiehun')).toBeDefined();
    expect(representativeRoutes.map((route) => route.family)).toEqual([
      'jieri',
      'zodiac',
      'zodiac article',
      'bazi',
      'naming',
      'feng-shui',
    ]);
  });

  it('builds canonical, hreflang, x-default, keywords, and Content-Language for representatives', () => {
    for (const route of representativeRoutes) {
      const metadata = buildSeoPageMetadata({
        locale: 'zh-hans',
        path: route.path,
        title: route.title,
        description: route.description,
        keywords: route.keywords,
      });

      expect(metadata.alternates?.canonical, route.family).toBe(`/zh-hans${route.path}`);
      expect(metadata.alternates?.languages, route.family).toMatchObject({
        'zh-Hans': `/zh-hans${route.path}`,
        'zh-Hant': `/zh-hant${route.path}`,
        'x-default': `/zh-hant${route.path}`,
      });
      expect(metadata.other?.['content-language'], route.family).toBe('zh-Hans');
      expect(metadata.keywords, route.family).toEqual(expect.arrayContaining(route.keywords));
    }
  });

  it('uses Traditional Content-Language and canonical path for zh-Hant representatives', () => {
    const route = representativeRoutes.find((item) => item.family === 'feng-shui')!;
    const metadata = buildSeoPageMetadata({
      locale: 'zh-hant',
      path: route.path,
      title: route.title,
      description: route.description,
      keywords: route.keywords,
    });

    expect(metadata.alternates?.canonical).toBe(`/zh-hant${route.path}`);
    expect(metadata.other?.['content-language']).toBe('zh-Hant');
    expect(metadata.alternates?.languages).toHaveProperty('x-default', `/zh-hant${route.path}`);
  });
});
