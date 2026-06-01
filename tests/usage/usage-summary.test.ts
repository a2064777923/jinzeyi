import { describe, expect, it } from 'vitest';
import { buildUsageSummary, type UsageSummarySourceEvent } from '@/lib/usage/summary';
import { isUsageAccessAllowed } from '@/lib/usage/auth';

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

describe('usage summary', () => {
  it('builds product-facing usage counts and topic signals', () => {
    const summary = buildUsageSummary([
      event({ path: '/zh-hans/tools/bazi' }),
      event({
        eventName: 'tool_submit',
        area: 'bazi',
        payload: { birthDate: '1990-03-15', cityId: 'hangzhou' },
        result: { dayMaster: '甲' },
      }),
      event({
        eventName: 'tool_submit',
        area: 'jieri-recommend',
        payload: { scene: 'shangxue', cityIds: ['hangzhou', 'beijing'] },
      }),
      event({
        eventName: 'almanac_search',
        area: 'almanac',
        payload: { date: '2026-06-01' },
      }),
    ], 30);

    expect(summary.totalEvents).toBe(4);
    expect(summary.pageViews).toBe(1);
    expect(summary.toolSubmits).toBe(2);
    expect(summary.uniqueVisitors).toBe(1);
    expect(summary.topPaths[0]).toEqual({ key: '/zh-hans/tools/bazi', count: 1 });
    expect(summary.topScenes[0]).toEqual({ key: 'shangxue', count: 1 });
    expect(summary.topBaziBirthYears[0]).toEqual({ key: '1990', count: 1 });
    expect(summary.topCities).toEqual([
      { key: 'hangzhou', count: 2 },
      { key: 'beijing', count: 1 },
    ]);
    expect(summary.topAlmanacDates[0]).toEqual({ key: '2026-06-01', count: 1 });
  });

  it('does not allow summary access without an admin session cookie', () => {
    const request = {
      cookies: {
        get: () => undefined,
      },
    };

    expect(isUsageAccessAllowed(request as never)).toBe(false);
  });
});
