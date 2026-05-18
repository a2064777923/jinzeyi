export const LEGAL_YEAR_MIN = 2;
export const LEGAL_YEAR_MAX = 5000;
export const ALMANAC_DATE_MIN = '0002-01-01';
export const ALMANAC_DATE_MAX = '5000-12-31';

export function formatAlmanacYear(year: number): string {
  return String(year).padStart(4, '0');
}

export function formatAlmanacDate(year: number, month: number, day: number): string {
  return `${formatAlmanacYear(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatAlmanacMonth(year: number, month: number): string {
  return `${formatAlmanacYear(year)}-${String(month).padStart(2, '0')}`;
}

export function isLegalRouteYear(year: number): boolean {
  return Number.isInteger(year) && year >= LEGAL_YEAR_MIN && year <= LEGAL_YEAR_MAX;
}

export function isValidAlmanacMonthString(value: string): boolean {
  if (!/^\d{4}-\d{2}$/.test(value)) return false;

  const [year, month] = value.split('-').map(Number);
  return isLegalRouteYear(year) && month >= 1 && month <= 12;
}

export function isValidAlmanacDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  if (!isLegalRouteYear(year) || month < 1 || month > 12) return false;

  return day >= 1 && day <= getDaysInMonth(year, month);
}

function getDaysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
