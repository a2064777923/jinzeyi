import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  getRouteByPath,
  getSitemapCandidates,
} from '@/lib/content/registry';
import { getMetaphysicsEntry } from '@/lib/content/metaphysics';
import { buildPageJsonLd } from '@/lib/seo';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children }: { children: unknown }) => children,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: unknown }) => children,
}));

vi.mock('@/components/knowledge/KnowledgeEntryCard', () => ({
  KnowledgeEntryCard: () => null,
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

const indexSource = readFileSync(join(process.cwd(), 'src/app/[locale]/knowledge/page.tsx'), 'utf8');
const entrySource = readFileSync(join(process.cwd(), 'src/app/[locale]/knowledge/[slug]/page.tsx'), 'utf8');
const entryModule = await import('@/app/[locale]/knowledge/[slug]/page');

describe('knowledge route contracts', () => {
  it('renders index from the metaphysics registry', () => {
    expect(indexSource).toContain('knowledgeIndexPage');
    expect(indexSource).toContain('getMetaphysicsEntriesByCategory');
    expect(indexSource).toContain('KnowledgeEntryCard');
  });

  it('generates static params for knowledge entries', () => {
    const params = entryModule.generateStaticParams();

    expect(params).toContainEqual({ slug: 'day-master' });
    expect(params).toContainEqual({ slug: 'zhou-tian-xing-dou' });
  });

  it('uses centralized metadata and JSON-LD helpers', () => {
    expect(indexSource).toContain('buildSeoPageMetadata');
    expect(indexSource).toContain('buildPageJsonLd');
    expect(entrySource).toContain('buildSeoPageMetadata');
    expect(entrySource).toContain('buildPageJsonLd');
    expect(entrySource).toContain('notFound()');
    expect(entrySource).toContain('breadcrumbs');
  });

  it('builds Article and BreadcrumbList JSON-LD for detail pages', () => {
    const entry = getMetaphysicsEntry('day-master')!;
    const jsonLd = buildPageJsonLd({
      locale: 'zh-hans',
      path: entry.path,
      title: entry.seo.zhHans.title,
      description: entry.seo.zhHans.description,
      pageType: 'Article',
      breadcrumbs: [
        { name: '首页', href: '/' },
        { name: '命理知识库', href: '/knowledge' },
        { name: entry.name, href: entry.path },
      ],
    });

    expect(jsonLd.map((item) => item['@type'])).toEqual(['Article', 'BreadcrumbList']);
  });

  it('registers knowledge pages for sitemap candidates without AI routes', () => {
    const sitemapPaths = getSitemapCandidates().map((route) => route.path);

    expect(getRouteByPath('/knowledge')).toBeDefined();
    expect(getRouteByPath('/knowledge/day-master')).toBeDefined();
    expect(sitemapPaths).toContain('/knowledge');
    expect(sitemapPaths).toContain('/knowledge/day-master');
    expect(sitemapPaths).toContain('/knowledge/zhou-tian-xing-dou');
    expect(sitemapPaths.some((path) => path.includes('/ai'))).toBe(false);
  });
});
