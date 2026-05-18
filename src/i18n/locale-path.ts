import { routing } from './routing';

type Locale = (typeof routing.locales)[number];

const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);

function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function stripLocalePrefixes(pathname: string): string {
  let path = normalizePathname(pathname);

  while (localePattern.test(path)) {
    path = path.replace(localePattern, '') || '/';
  }

  return path;
}

export function buildLocaleHref({
  pathname,
  search = '',
  hash = '',
  targetLocale,
}: {
  pathname: string;
  search?: string;
  hash?: string;
  targetLocale: Locale;
}): string {
  const pathWithoutLocale = stripLocalePrefixes(pathname);
  const suffix = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
  return `/${targetLocale}${suffix}${search}${hash}`;
}
