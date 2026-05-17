import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fengShuiArticles, getZodiacArticlesForAnimal } from '@/lib/content/registry';

export const PHASE3_SMOKE_URLS = [
  '/zh-hant/jieri/jiehun/2026',
  '/zh-hant/zodiac/rat',
  `/zh-hant${getZodiacArticlesForAnimal('rat')[0].path}`,
  `/zh-hant${fengShuiArticles[0].path}`,
  '/zh-hant/tools/bazi',
  '/zh-hant/tools/naming',
  '/zh-hant/sitemap.xml',
];

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Phase 3 representative smoke list', () => {
  it('enumerates representative URLs for all Phase 3 route families', () => {
    expect(PHASE3_SMOKE_URLS).toEqual([
      '/zh-hant/jieri/jiehun/2026',
      '/zh-hant/zodiac/rat',
      '/zh-hant/zodiac/rat/rat-xingge',
      '/zh-hant/feng-shui/home/xuan-guan-ke-ting',
      '/zh-hant/tools/bazi',
      '/zh-hant/tools/naming',
      '/zh-hant/sitemap.xml',
    ]);
  });

  it('representative pages include visible content, FAQ/form widgets, and JSON-LD hooks', () => {
    const sources = [
      source('src/app/[locale]/jieri/[scene]/[year]/page.tsx'),
      source('src/app/[locale]/zodiac/[animal]/page.tsx'),
      source('src/app/[locale]/zodiac/[animal]/[slug]/page.tsx'),
      source('src/app/[locale]/feng-shui/[category]/[slug]/page.tsx'),
      source('src/app/[locale]/tools/bazi/page.tsx'),
      source('src/app/[locale]/tools/naming/page.tsx'),
    ].join('\n');

    expect(sources).toContain('application/ld+json');
    expect(sources).toContain('Faq');
    expect(sources).toContain('BaziForm');
    expect(sources).toContain('NamingForm');
    expect(sources).toContain('notFound()');
  });

  it('tool widgets expose the required visible form labels', () => {
    const baziForm = source('src/components/tools/BaziForm.tsx');
    const namingForm = source('src/components/tools/NamingForm.tsx');

    for (const label of ['出生日期', '精确时间', '精確時間', '出生地点', '出生地點', '性别', '性別']) {
      expect(baziForm).toContain(label);
    }
    for (const label of ['姓氏', '名字']) {
      expect(namingForm).toContain(label);
    }
  });
});
