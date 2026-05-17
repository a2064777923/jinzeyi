import { describe, expect, it } from 'vitest';
import {
  getZodiacArticlesForAnimal,
  zodiacAnimals,
  zodiacArticles,
} from '@/lib/content/zodiac';

describe('zodiac content registry', () => {
  it('contains exactly 12 zodiac profiles', () => {
    expect(zodiacAnimals).toHaveLength(12);
    expect(new Set(zodiacAnimals.map((animal) => animal.slug)).size).toBe(12);
  });

  it('gives every profile compatibility highlights and related jieri links', () => {
    for (const profile of zodiacAnimals) {
      expect(profile.compatibility.best.length, profile.slug).toBeGreaterThan(0);
      expect(profile.compatibility.caution.length, profile.slug).toBeGreaterThan(0);
      expect(profile.relatedLinks.some((link) => link.family === 'jieri'), profile.slug).toBe(true);
      expect(profile.faq.length, profile.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('contains 2 articles per animal and stays inside the MVP article count', () => {
    expect(zodiacArticles.length).toBeGreaterThanOrEqual(24);
    expect(zodiacArticles.length).toBeLessThanOrEqual(36);

    for (const profile of zodiacAnimals) {
      expect(getZodiacArticlesForAnimal(profile.slug), profile.slug).toHaveLength(2);
    }
  });

  it('requires article source notes, FAQ, related links, and non-template body copy', () => {
    const bodies = new Set(zodiacArticles.map((article) => article.body));

    expect(bodies.size).toBe(zodiacArticles.length);

    for (const article of zodiacArticles) {
      expect(article.sourceNotes.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.faq.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.relatedLinks.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.paragraphs.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.body.length, article.slug).toBeGreaterThan(120);
    }
  });
});

