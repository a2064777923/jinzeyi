import { describe, expect, it } from 'vitest';
import { analyzeName } from '@/lib/tools/naming';

describe('naming five-element utility', () => {
  it('analyzes known Chinese characters with element entries', () => {
    const result = analyzeName({ surname: '李', givenName: '明泽' });

    expect(result.characters).toHaveLength(3);
    expect(result.characters.every((item) => item.known)).toBe(true);
    expect(result.characters.map((item) => item.element)).toContain('木');
    expect(result.characters.map((item) => item.element)).toContain('火');
    expect(result.characters.map((item) => item.element)).toContain('水');
  });

  it('handles unknown Chinese characters conservatively', () => {
    const result = analyzeName({ surname: '李', givenName: '龘' });

    expect(result.characters.some((item) => !item.known)).toBe(true);
    expect(result.explanation).toContain('暂未收录');
  });

  it('rejects empty, numeric, and symbol-only names', () => {
    expect(() => analyzeName({ surname: '', givenName: '明' })).toThrow();
    expect(() => analyzeName({ surname: '1', givenName: '明' })).toThrow();
    expect(() => analyzeName({ surname: '李', givenName: '@' })).toThrow();
  });

  it('returns score, explanation, auspicious flag, and suggestions without bazi input', () => {
    const result = analyzeName({ surname: '王', givenName: '安宁' });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(typeof result.auspicious).toBe('boolean');
    expect(result.explanation).toContain('姓名文化参考');
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});
