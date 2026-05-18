import { describe, expect, it } from 'vitest';
import sitemap from '@/app/[locale]/sitemap';
import { jieriScenes } from '@/lib/content/registry';

async function loadSitemap(locale: 'zh-hant' | 'zh-hans' = 'zh-hant') {
  return sitemap({ params: Promise.resolve({ locale }) });
}

describe('locale sitemap', () => {
  it('includes registry routes and Phase 3 article/tool URLs', async () => {
    const entries = await loadSitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('http://43.139.84.61:3000/zh-hant');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/tools/bazi');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/tools/naming');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/zodiac/rat');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/zodiac/rat/rat-xingge');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/feng-shui/home/xuan-guan-ke-ting');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/knowledge');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/knowledge/zhou-tian-xing-dou');
    expect(urls).toContain('http://43.139.84.61:3000/zh-hant/knowledge/day-master');
  });

  it('includes Simplified knowledge URLs from registry candidates', async () => {
    const entries = await loadSitemap('zh-hans');
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('http://43.139.84.61:3000/zh-hans/knowledge/day-master');
    expect(urls.some((url) => url.includes('/ai'))).toBe(false);
  });

  it('includes indexed jieri years 2006 and 2046 but not full legal year range', async () => {
    const scene = jieriScenes[0].slug;
    const entries = await loadSitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`http://43.139.84.61:3000/zh-hant/jieri/${scene}/2006`);
    expect(urls).toContain(`http://43.139.84.61:3000/zh-hant/jieri/${scene}/2046`);
    expect(urls).not.toContain(`http://43.139.84.61:3000/zh-hant/jieri/${scene}/0`);
    expect(urls).not.toContain(`http://43.139.84.61:3000/zh-hant/jieri/${scene}/1`);
    expect(urls).not.toContain(`http://43.139.84.61:3000/zh-hant/jieri/${scene}/5000`);
  });

  it('adds zh-Hans, zh-Hant, and x-default alternates to every entry', async () => {
    const entries = await loadSitemap('zh-hans');

    expect(entries.length).toBeGreaterThan(100);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toMatchObject({
        'zh-Hans': expect.stringContaining('/zh-hans'),
        'zh-Hant': expect.stringContaining('/zh-hant'),
        'x-default': expect.stringContaining('/zh-hant'),
      });
    }
  });

  it('falls back safely when Next invokes metadata sitemap without params', async () => {
    const entries = await sitemap();

    expect(entries[0].url).toContain('/zh-hant');
    expect(entries[0].alternates?.languages).toHaveProperty('zh-Hans');
  });
});
