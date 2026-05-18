import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  getRouteByPath,
  getSitemapCandidates,
} from '@/lib/content/registry';
import { getToolPage } from '@/lib/content/tools';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@/components/jieri/AuspiciousRecommendationForm', () => ({
  AuspiciousRecommendationForm: () => null,
}));

vi.mock('@/components/seo/FaqBlock', () => ({
  FaqBlock: () => null,
}));

vi.mock('@/components/seo/InternalLinkGrid', () => ({
  InternalLinkGrid: () => null,
}));

vi.mock('@/components/seo/SeoHero', () => ({
  SeoHero: () => null,
}));

vi.mock('@/components/seo/SeoPageShell', () => ({
  SeoPageShell: ({ children }: { children: unknown }) => children,
  SeoPageBand: ({ children }: { children: unknown }) => children,
}));

const routeSource = readFileSync(join(process.cwd(), 'src/app/[locale]/tools/jieri-recommend/page.tsx'), 'utf8');
const formSource = readFileSync(join(process.cwd(), 'src/components/jieri/AuspiciousRecommendationForm.tsx'), 'utf8');
const resultSource = readFileSync(join(process.cwd(), 'src/components/jieri/AuspiciousRecommendationResult.tsx'), 'utf8');
const scoreSource = readFileSync(join(process.cwd(), 'src/components/jieri/ScoreBreakdown.tsx'), 'utf8');
const scenePageSource = readFileSync(join(process.cwd(), 'src/components/jieri/JieriScenePage.tsx'), 'utf8');
const routeModule = await import('@/app/[locale]/tools/jieri-recommend/page');

describe('jieri recommendation route contracts', () => {
  it('creates a locale-aware tool route with metadata and WebApplication JSON-LD', async () => {
    expect(routeSource).toContain('generateMetadata');
    expect(routeSource).toContain('buildSeoPageMetadata');
    expect(routeSource).toContain('buildPageJsonLd');
    expect(routeSource).toContain("pageType: 'WebApplication'");
    expect(routeSource).toContain('AuspiciousRecommendationForm');

    const metadata = await routeModule.generateMetadata({
      params: Promise.resolve({ locale: 'zh-hans' }),
    });
    expect(metadata.alternates?.canonical).toBe('/zh-hans/tools/jieri-recommend');
  });

  it('wires the client flow and score breakdown labels', () => {
    expect(formSource).toContain('export function AuspiciousRecommendationForm');
    expect(resultSource).toContain('export function AuspiciousRecommendationResult');
    expect(scoreSource).toContain('export function ScoreBreakdown');
    expect(formSource).toContain('选择场景');
    expect(formSource).toContain('参与者资料');
    expect(formSource).toContain('日期范围');
    expect(resultSource).toContain('推荐结果');
    expect(resultSource).toContain('ScoreBreakdown');
  });

  it('links annual jieri pages into the recommendation flow', () => {
    expect(scenePageSource).toContain('/tools/jieri-recommend');
    expect(scenePageSource).toContain('scene.slug');
  });

  it('registers the route as a sitemap tool page', () => {
    const page = getToolPage('jieri-recommend');
    const sitemapPaths = getSitemapCandidates().map((route) => route.path);

    expect(page?.path).toBe('/tools/jieri-recommend');
    expect(getRouteByPath('/tools/jieri-recommend')).toBeDefined();
    expect(sitemapPaths).toContain('/tools/jieri-recommend');
    expect(sitemapPaths.some((path) => path.includes('/ai'))).toBe(false);
  });
});
