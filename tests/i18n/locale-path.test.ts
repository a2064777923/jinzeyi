import { describe, expect, it } from 'vitest';
import { buildLocaleHref, stripLocalePrefixes } from '@/i18n/locale-path';

describe('locale path helpers', () => {
  it('switches locale without duplicating locale prefixes', () => {
    expect(
      buildLocaleHref({
        pathname: '/zh-hant/solar-terms',
        targetLocale: 'zh-hans',
      })
    ).toBe('/zh-hans/solar-terms');
  });

  it('strips repeated locale prefixes from a previously malformed URL', () => {
    expect(stripLocalePrefixes('/zh-hant/zh-hans/calendar')).toBe('/calendar');
  });

  it('preserves search params and hashes', () => {
    expect(
      buildLocaleHref({
        pathname: '/zh-hans/calendar',
        search: '?month=2026-05',
        hash: '#top',
        targetLocale: 'zh-hant',
      })
    ).toBe('/zh-hant/calendar?month=2026-05#top');
  });

  it('handles the locale root', () => {
    expect(buildLocaleHref({ pathname: '/zh-hant', targetLocale: 'zh-hans' })).toBe(
      '/zh-hans'
    );
  });
});
