export interface UsageSummarySourceEvent {
  eventName: string;
  area: string;
  status: string | null;
  locale: string | null;
  path: string | null;
  visitorHash: string | null;
  payload: unknown;
  result: unknown;
  createdAt: Date;
}

export interface UsageTopItem {
  key: string;
  count: number;
}

export interface UsageSummary {
  days: number;
  totalEvents: number;
  pageViews: number;
  toolSubmits: number;
  toolErrors: number;
  uniqueVisitors: number | null;
  byDay: UsageTopItem[];
  byArea: UsageTopItem[];
  byLocale: UsageTopItem[];
  topPaths: UsageTopItem[];
  topScenes: UsageTopItem[];
  topBaziBirthYears: UsageTopItem[];
  topCities: UsageTopItem[];
  topAlmanacDates: UsageTopItem[];
  latestToolEvents: Array<{
    eventName: string;
    area: string;
    status: string | null;
    locale: string | null;
    path: string | null;
    payload: unknown;
    result: unknown;
    createdAt: string;
  }>;
}

export function buildUsageSummary(events: UsageSummarySourceEvent[], days: number): UsageSummary {
  const byDay = new Map<string, number>();
  const byArea = new Map<string, number>();
  const byLocale = new Map<string, number>();
  const topPaths = new Map<string, number>();
  const topScenes = new Map<string, number>();
  const topBaziBirthYears = new Map<string, number>();
  const topCities = new Map<string, number>();
  const topAlmanacDates = new Map<string, number>();
  const visitors = new Set<string>();

  let pageViews = 0;
  let toolSubmits = 0;
  let toolErrors = 0;

  for (const event of events) {
    increment(byDay, dayKey(event.createdAt));
    increment(byArea, event.area);
    if (event.locale) increment(byLocale, event.locale);
    if (event.visitorHash) visitors.add(event.visitorHash);

    if (event.eventName === 'page_view') {
      pageViews += 1;
      if (event.path) increment(topPaths, event.path);
    }

    if (event.eventName === 'tool_submit') toolSubmits += 1;
    if (event.eventName === 'tool_error') toolErrors += 1;

    const payload = asRecord(event.payload);
    if (!payload) continue;

    if (event.area === 'jieri-recommend') {
      increment(topScenes, readString(payload.scene));
      for (const city of readStringArray(payload.cityIds)) increment(topCities, city);
    }

    if (event.area === 'bazi') {
      increment(topBaziBirthYears, readBirthYear(payload));
      increment(topCities, readString(payload.cityId));
    }

    if (event.eventName === 'almanac_search') {
      increment(topAlmanacDates, readString(payload.date));
    }
  }

  return {
    days,
    totalEvents: events.length,
    pageViews,
    toolSubmits,
    toolErrors,
    uniqueVisitors: visitors.size > 0 ? visitors.size : null,
    byDay: topItems(byDay, 60).sort((a, b) => a.key.localeCompare(b.key)),
    byArea: topItems(byArea),
    byLocale: topItems(byLocale),
    topPaths: topItems(topPaths, 20),
    topScenes: topItems(topScenes),
    topBaziBirthYears: topItems(topBaziBirthYears),
    topCities: topItems(topCities),
    topAlmanacDates: topItems(topAlmanacDates),
    latestToolEvents: events
      .filter((event) => event.eventName === 'tool_submit' || event.eventName === 'tool_error' || event.eventName === 'almanac_search')
      .slice(0, 60)
      .map((event) => ({
        eventName: event.eventName,
        area: event.area,
        status: event.status,
        locale: event.locale,
        path: event.path,
        payload: event.payload,
        result: event.result,
        createdAt: event.createdAt.toISOString(),
      })),
  };
}

function increment(map: Map<string, number>, key: string | undefined): void {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topItems(map: Map<string, number>, limit = 12): UsageTopItem[] {
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function readBirthYear(payload: Record<string, unknown>): string | undefined {
  if (typeof payload.birthYear === 'number' && Number.isFinite(payload.birthYear)) {
    return String(payload.birthYear);
  }

  const birthDate = readString(payload.birthDate);
  const match = birthDate?.match(/^(\d{4})-/);
  return match?.[1];
}
