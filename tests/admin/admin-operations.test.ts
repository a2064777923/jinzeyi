import { describe, expect, it } from 'vitest';
import {
  buildAiCases,
  buildAssetInventory,
  buildContentInventory,
  buildContentOpportunities,
  normalizeTrackedPath,
  routeLabel,
} from '@/lib/admin/operations';
import { buildUsageSummary, type UsageSummarySourceEvent } from '@/lib/usage/summary';

function event(partial: Partial<UsageSummarySourceEvent>): UsageSummarySourceEvent {
  return {
    eventName: 'page_view',
    area: 'site',
    status: 'success',
    locale: 'zh-hans',
    path: '/zh-hans',
    visitorHash: 'visitor-1',
    payload: null,
    result: null,
    createdAt: new Date('2026-06-01T10:00:00Z'),
    ...partial,
  };
}

describe('admin operations', () => {
  it('normalizes localized paths and resolves readable route labels', () => {
    expect(normalizeTrackedPath('/zh-hans/tools/bazi')).toBe('/tools/bazi');
    expect(normalizeTrackedPath('/zh-hant/zodiac/rat?x=1')).toBe('/zodiac/rat');
    expect(routeLabel('/zh-hans/tools/bazi')).toBe('八字排盘');
  });

  it('builds content opportunities from usage signals', () => {
    const summary = buildUsageSummary([
      event({ path: '/zh-hans/tools/bazi' }),
      event({
        eventName: 'tool_submit',
        area: 'jieri-recommend',
        payload: { scene: 'shangxue', cityIds: ['beijing'] },
      }),
      event({
        eventName: 'almanac_search',
        area: 'almanac',
        payload: { date: '2026-06-01' },
      }),
    ], 30);

    const opportunities = buildContentOpportunities(summary, 6);

    expect(opportunities.some((item) => item.title.includes('上学'))).toBe(true);
    expect(opportunities.some((item) => item.href === '/almanac/2026-06-01')).toBe(true);
    expect(opportunities.some((item) => item.title.includes('八字排盘'))).toBe(true);
  });

  it('builds inventory and AI cards without database access', () => {
    const summary = buildUsageSummary([
      event({
        eventName: 'tool_submit',
        area: 'bazi',
        payload: { birthDate: '1990-03-15', birthTime: '09:30' },
        result: { dayMaster: '甲' },
      }),
    ], 30);

    expect(buildContentInventory().length).toBeGreaterThan(0);
    expect(buildAssetInventory().some((group) => group.key === 'zodiac' && group.total === 12)).toBe(true);
    expect(buildAiCases(summary, 3)[0]?.title).toBe('八字盘面延展');
  });
});
