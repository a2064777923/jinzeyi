import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
}));

vi.mock('@/components/feng-shui/FengShuiArticle', () => ({ FengShuiArticle: () => null }));
vi.mock('@/components/feng-shui/FengShuiIndex', () => ({ FengShuiIndex: () => null }));
vi.mock('@/components/seo/SeoPageShell', () => ({
  SeoPageShell: ({ children }: { children: unknown }) => children,
  SeoPageBand: ({ children }: { children: unknown }) => children,
}));

const articleModule = await import('@/app/[locale]/feng-shui/[category]/[slug]/page');
const indexSource = readFileSync(join(process.cwd(), 'src/app/[locale]/feng-shui/page.tsx'), 'utf8');
const articleSource = readFileSync(join(process.cwd(), 'src/app/[locale]/feng-shui/[category]/[slug]/page.tsx'), 'utf8');

describe('feng shui route contracts', () => {
  it('index renders from registry data', () => {
    expect(indexSource).toContain('fengShuiIndexPage');
    expect(indexSource).toContain('FengShuiIndex');
  });

  it('generates static params for roughly ten articles', () => {
    const params = articleModule.generateStaticParams();
    expect(params.length).toBeGreaterThanOrEqual(8);
    expect(params.length).toBeLessThanOrEqual(12);
  });

  it('uses registry lookup and notFound on missing article', () => {
    expect(articleSource).toContain('getFengShuiArticle');
    expect(articleSource).toContain('getFengShuiCategory');
    expect(articleSource).toContain('notFound()');
  });

  it('renders Article, FAQ, and Breadcrumb JSON-LD helpers', () => {
    expect(articleSource).toContain('buildArticleJsonLd');
    expect(articleSource).toContain('buildFaqJsonLd');
    expect(articleSource).toContain('buildBreadcrumbJsonLd');
  });
});
