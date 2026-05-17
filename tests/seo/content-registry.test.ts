import { describe, expect, it } from 'vitest';
import {
  getIndexableRoutes,
  getRouteByPath,
  getSitemapCandidates,
} from '@/lib/content/registry';
import type { IndexablePage } from '@/lib/content/types';

function countChineseCharacters(value: string): number {
  return Array.from(value).filter((char) => /\p{Script=Han}/u.test(char)).length;
}

function assertCompleteSeo(route: IndexablePage): void {
  for (const localeKey of ['zhHans', 'zhHant'] as const) {
    const seo = route.seo[localeKey];

    expect(seo.title, `${route.path} ${localeKey} title`).toBeTruthy();
    expect(seo.description, `${route.path} ${localeKey} description`).toBeTruthy();
    expect(seo.h1, `${route.path} ${localeKey} h1`).toBeTruthy();
    expect(seo.deck, `${route.path} ${localeKey} deck`).toBeTruthy();
    expect(seo.keywords.length, `${route.path} ${localeKey} keywords`).toBeGreaterThan(0);
  }
}

describe('Phase 3 content registry', () => {
  it('exposes indexable routes from one registry', () => {
    const routes = getIndexableRoutes();

    expect(routes.length).toBeGreaterThan(10);
    expect(getRouteByPath('/')).toBeDefined();
    expect(getRouteByPath('/jieri')).toBeDefined();
    expect(getRouteByPath('/tools/bazi')).toBeDefined();
  });

  it('does not contain duplicate route paths', () => {
    const routes = getIndexableRoutes();
    const paths = routes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('does not contain duplicate slugs within a family', () => {
    const routes = getIndexableRoutes();
    const familySlugs = routes.map((route) => `${route.family}:${route.slug}`);

    expect(new Set(familySlugs).size).toBe(familySlugs.length);
  });

  it('requires locale SEO, FAQ content, related links, and seed metadata for every indexable page', () => {
    for (const route of getIndexableRoutes()) {
      assertCompleteSeo(route);
      expect(route.faq.length, `${route.path} FAQ`).toBeGreaterThanOrEqual(2);
      expect(route.relatedLinks.length, `${route.path} related links`).toBeGreaterThanOrEqual(2);
      expect(route.seed.model, `${route.path} seed target`).toBeTruthy();
      expect(route.seed.slug, `${route.path} seed slug`).toBeTruthy();
    }
  });

  it('requires article-like entries to carry substantial canonical body copy', () => {
    const articleLikeRoutes = getIndexableRoutes().filter((route) => route.pageType === 'Article');

    for (const route of articleLikeRoutes) {
      expect(countChineseCharacters(route.body), route.path).toBeGreaterThanOrEqual(120);
    }
  });

  it('keeps sitemap candidates as a declared subset of the registry', () => {
    const routes = getIndexableRoutes();
    const candidates = getSitemapCandidates();
    const routeIds = new Set(routes.map((route) => route.id));

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.every((candidate) => routeIds.has(candidate.id))).toBe(true);
    expect(candidates.every((candidate) => candidate.sitemap)).toBe(true);
  });
});

