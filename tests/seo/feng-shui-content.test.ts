import { describe, expect, it } from 'vitest';
import {
  fengShuiArticles,
  fengShuiCategories,
  getFengShuiArticlesByCategory,
} from '@/lib/content/feng-shui';

describe('feng shui content registry', () => {
  it('contains the five planned categories', () => {
    expect(fengShuiCategories.map((category) => category.slug)).toEqual([
      'home',
      'office',
      'shop',
      'directions',
      'wealth',
    ]);
  });

  it('contains roughly two articles per category', () => {
    expect(fengShuiArticles.length).toBeGreaterThanOrEqual(8);
    expect(fengShuiArticles.length).toBeLessThanOrEqual(12);

    for (const category of fengShuiCategories) {
      expect(getFengShuiArticlesByCategory(category.slug).length, category.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives every article practical checklist, faq, source notes, and links', () => {
    const bodies = new Set(fengShuiArticles.map((article) => article.body));
    expect(bodies.size).toBe(fengShuiArticles.length);

    for (const article of fengShuiArticles) {
      expect(article.checklist.length, article.slug).toBeGreaterThanOrEqual(3);
      expect(article.faq.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.relatedLinks.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.sourceNotes.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.sections.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.body.length, article.slug).toBeGreaterThan(160);
      expect(article.path).toBe(`/feng-shui/${article.categorySlug}/${article.slug}`);
    }
  });
});
