import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getGlossaryEntry } from '@/lib/content/glossary';
import {
  getMetaphysicsEntries,
  getMetaphysicsEntriesByCategory,
  getMetaphysicsEntry,
  knowledgeIndexPage,
  metaphysicsEntries,
} from '@/lib/content/metaphysics';

const requiredSlugs = [
  'four-pillars',
  'day-master',
  'ten-gods',
  'hidden-stems',
  'na-yin',
  'five-elements',
  'chong-sha',
  'yi-ji',
  'lucky-hour',
  'twenty-eight-mansions',
  'zi-wei-dou-shu',
  'zhou-tian-xing-dou',
];

describe('metaphysics knowledge taxonomy', () => {
  it('contains required first-version entries', () => {
    const slugs = metaphysicsEntries.map((entry) => entry.slug);

    for (const slug of requiredSlugs) {
      expect(slugs).toContain(slug);
      expect(getMetaphysicsEntry(slug)).toBeDefined();
    }
  });

  it('requires structured fields on every entry', () => {
    for (const entry of metaphysicsEntries) {
      expect(entry.family).toBe('knowledge');
      expect(entry.pageType).toBe('Article');
      expect(entry.name, entry.slug).toBeTruthy();
      expect(entry.category, entry.slug).toBeTruthy();
      expect(entry.short, entry.slug).toBeTruthy();
      expect(entry.detail, entry.slug).toBeTruthy();
      expect(entry.practicalUse, entry.slug).toBeTruthy();
      expect(entry.relatedTerms.length, entry.slug).toBeGreaterThan(0);
      expect(entry.toolAppearances.length, entry.slug).toBeGreaterThan(0);
      expect(entry.mythologyStory, entry.slug).toBeTruthy();
      expect(entry.commonMisunderstandings.length, entry.slug).toBeGreaterThan(0);
      expect(entry.sourceNotes.length, entry.slug).toBeGreaterThan(0);
      expect(entry.path).toBe(`/knowledge/${entry.slug}`);
      expect(entry.seed.model).toBe('MetaphysicsEntry');
    }
  });

  it('keeps BaZi and scoring entries connected to related terms', () => {
    const entries = [
      ...getMetaphysicsEntriesByCategory('bazi'),
      ...getMetaphysicsEntriesByCategory('almanac'),
      getMetaphysicsEntry('five-elements'),
    ].filter(Boolean);

    for (const entry of entries) {
      expect(entry?.relatedTerms.length, entry?.slug).toBeGreaterThan(1);
    }
  });

  it('keeps glossary compatibility while backing core terms with knowledge entries', () => {
    const ganZhi = getGlossaryEntry('ganZhi', 'zh-hant');
    const fourPillars = getGlossaryEntry('fourPillars', 'zh-hans');
    const mingCaiWei = getGlossaryEntry('mingCaiWei', 'zh-hant');

    expect(ganZhi).toMatchObject({
      term: expect.any(String),
      short: expect.any(String),
      detail: expect.any(String),
    });
    expect(ganZhi.href).toBe('/knowledge/stem-branch');
    expect(fourPillars.href).toBe('/knowledge/four-pillars');
    expect(fourPillars.sourceNotes?.length).toBeGreaterThan(0);
    expect(mingCaiWei.href).toBe('/feng-shui/wealth/ming-cai-wei');
  });

  it('localizes entry body fields without changing slugs', () => {
    const entry = getMetaphysicsEntry('day-master', 'zh-hant');

    expect(entry?.slug).toBe('day-master');
    expect(entry?.name).toBe('日主');
    expect(entry?.linkLabel).toContain('完整知識頁');
  });

  it('avoids deterministic claim words in knowledge content', () => {
    const serialized = JSON.stringify(getMetaphysicsEntries());

    expect(serialized).not.toMatch(/必定|一定|保证|保證/);
  });

  it('keeps visible knowledge copy out of product-doc phrasing', () => {
    const serialized = JSON.stringify([
      knowledgeIndexPage,
      ...getMetaphysicsEntries(),
      getGlossaryEntry('fiveElements', 'zh-hant'),
      getGlossaryEntry('fourPillars', 'zh-hant'),
    ]);

    expect(serialized).not.toMatch(/先[^。；，]*再/);
    expect(serialized).not.toMatch(/此功能|工具用于|工具用於|请查看|請查看|查看完整/);
    expect(serialized).not.toMatch(/用户输入|用户先|用戶先|工具会|工具會/);
  });

  it('wires richer term hint source fields and knowledge links', () => {
    const termHintSource = readFileSync(
      join(process.cwd(), 'src/components/knowledge/TermHint.tsx'),
      'utf8',
    );

    expect(termHintSource).toContain('aria-label');
    expect(termHintSource).toContain('chartHint');
    expect(termHintSource).toContain('sourceNotes');
    expect(getGlossaryEntry('fourPillars', 'zh-hans').href).toContain('/knowledge');
  });
});
