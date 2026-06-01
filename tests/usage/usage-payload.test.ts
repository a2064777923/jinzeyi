import { describe, expect, it } from 'vitest';
import { parseUsageEventPayload } from '@/lib/usage/payload';

describe('usage payload parsing', () => {
  it('accepts a valid usage event and sanitizes nested data', () => {
    const parsed = parseUsageEventPayload({
      eventName: 'tool_submit',
      area: 'bazi',
      locale: 'zh-hans',
      status: 'success',
      sessionId: 'session-1',
      payload: {
        birthDate: '1990-03-15',
        notes: 'x'.repeat(300),
        nested: { unsupported: undefined, list: [1, Number.NaN, 'ok'] },
      },
    });

    expect(parsed).toMatchObject({
      eventName: 'tool_submit',
      area: 'bazi',
      locale: 'zh-hans',
      status: 'success',
      sessionId: 'session-1',
    });
    expect(parsed?.payload?.notes).toHaveLength(220);
    expect(parsed?.payload?.nested).toEqual({ list: [1, 'ok'] });
  });

  it('rejects unknown event names', () => {
    expect(parseUsageEventPayload({ eventName: 'unknown', area: 'site' })).toBeNull();
  });
});
