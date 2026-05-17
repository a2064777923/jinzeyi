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

vi.mock('@/components/jieri/JieriScenePage', () => ({
  JieriScenePage: () => null,
}));

const routeModule = await import('@/app/[locale]/jieri/[scene]/[year]/page');

const routeSource = readFileSync(
  join(process.cwd(), 'src/app/[locale]/jieri/[scene]/[year]/page.tsx'),
  'utf8',
);

describe('jieri route contracts', () => {
  it('generates static params for all indexed years and scenes only', () => {
    const params = generateStaticParams();

    expect(params).toContainEqual({ scene: 'jiehun', year: '2006' });
    expect(params).toContainEqual({ scene: 'jiehun', year: '2046' });
    expect(params).not.toContainEqual({ scene: 'jiehun', year: '0' });
    expect(params).not.toContainEqual({ scene: 'jiehun', year: '1' });
    expect(params).not.toContainEqual({ scene: 'jiehun', year: '5000' });
  });

  it('uses route-year guardrails and notFound for invalid values', () => {
    expect(routeSource).toContain('isLegalRouteYear');
    expect(routeSource).toContain('notFound()');
    expect(routeSource).toContain('parseRouteYear');
  });

  it('builds scene-year metadata with canonical path and content language', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'zh-hans', scene: 'jiehun', year: '2026' }),
    });

    expect(metadata.alternates?.canonical).toBe('/zh-hans/jieri/jiehun/2026');
    expect(metadata.other?.['content-language']).toBe('zh-Hans');
    expect(metadata.description).toContain('2026年结婚吉日');
  });

  it('renders JSON-LD scripts and shared SEO metadata helpers', () => {
    expect(routeSource).toContain('buildSeoPageMetadata');
    expect(routeSource).toContain('buildPageJsonLd');
    expect(routeSource).toContain('application/ld+json');
  });
});

const { generateMetadata, generateStaticParams } = routeModule;
