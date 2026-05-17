import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
}));

vi.mock('@/components/zodiac/ZodiacHub', () => ({ ZodiacHub: () => null }));
vi.mock('@/components/zodiac/ZodiacIndex', () => ({ ZodiacIndex: () => null }));
vi.mock('@/components/seo/ArticleLayout', () => ({ ArticleLayout: ({ children }: { children: unknown }) => children }));
vi.mock('@/components/seo/SeoPageShell', () => ({
  SeoPageShell: ({ children }: { children: unknown }) => children,
  SeoPageBand: ({ children }: { children: unknown }) => children,
}));

const hubModule = await import('@/app/[locale]/zodiac/[animal]/page');
const articleModule = await import('@/app/[locale]/zodiac/[animal]/[slug]/page');

const hubSource = readFileSync(join(process.cwd(), 'src/app/[locale]/zodiac/[animal]/page.tsx'), 'utf8');
const articleSource = readFileSync(join(process.cwd(), 'src/app/[locale]/zodiac/[animal]/[slug]/page.tsx'), 'utf8');

describe('zodiac route contracts', () => {
  it('generates 12 hub params', () => {
    expect(hubModule.generateStaticParams()).toHaveLength(12);
  });

  it('generates article params within MVP count', () => {
    const params = articleModule.generateStaticParams();

    expect(params.length).toBeGreaterThanOrEqual(24);
    expect(params.length).toBeLessThanOrEqual(36);
  });

  it('uses registry lookup and notFound on hub and article pages', () => {
    expect(hubSource).toContain('getZodiacProfile');
    expect(hubSource).toContain('notFound()');
    expect(articleSource).toContain('getZodiacArticle');
    expect(articleSource).toContain('notFound()');
  });

  it('article page renders Article JSON-LD helpers', () => {
    expect(articleSource).toContain('buildArticleJsonLd');
    expect(articleSource).toContain('buildFaqJsonLd');
    expect(articleSource).toContain('ArticleLayout');
  });
});

