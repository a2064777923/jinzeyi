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
    expect(formSource).toContain('事项');
    expect(formSource).toContain('关键参与者');
    expect(formSource).toContain('日期范围');
    expect(resultSource).toContain('推荐结果');
    expect(resultSource).toContain('候选日会出现在这里');
    expect(resultSource).toContain('ScoreBreakdown');
  });

  it('keeps recommendation UI copy user-facing instead of product-doc style', () => {
    const combined = [routeSource, formSource, resultSource, scenePageSource].join('\n');

    expect(combined).not.toMatch(/先[^'"\n。]*再/);
    expect(combined).not.toMatch(/请查看|請查看|此功能|工具用于|工具用於|获取可解释/);
    expect(combined).not.toContain('查看当日黄历');
    expect(formSource).toContain('找合适日期');
    expect(resultSource).toContain('打开当日黄历');
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
