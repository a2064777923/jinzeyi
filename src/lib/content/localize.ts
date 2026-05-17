import { convertToTraditional } from '@/lib/opencc';
import type { LocaleCode, LocaleSeoFields, LocalizedSeo, LocalizedValue } from './types';

function localeKey(locale: LocaleCode): keyof LocalizedValue {
  return locale === 'zh-hans' ? 'zhHans' : 'zhHant';
}

export function localizeBodyCopy(locale: LocaleCode, value: string | LocalizedValue): string {
  if (typeof value !== 'string') {
    return value[localeKey(locale)];
  }

  return locale === 'zh-hant' ? convertToTraditional(value) : value;
}

export function localizeSeo(locale: LocaleCode, seo: LocalizedSeo): LocaleSeoFields {
  return seo[localeKey(locale)];
}

export function createLocalizedSeo(
  zhHans: LocaleSeoFields,
  zhHant?: Partial<LocaleSeoFields>,
): LocalizedSeo {
  return {
    zhHans,
    zhHant: {
      title: zhHant?.title ?? convertToTraditional(zhHans.title),
      description: zhHant?.description ?? convertToTraditional(zhHans.description),
      h1: zhHant?.h1 ?? convertToTraditional(zhHans.h1),
      deck: zhHant?.deck ?? convertToTraditional(zhHans.deck),
      keywords: zhHant?.keywords ?? zhHans.keywords.map((keyword) => convertToTraditional(keyword)),
    },
  };
}

