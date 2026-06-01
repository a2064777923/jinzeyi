import {
  usageEventNames,
  usageLocales,
  usageStatuses,
  type UsageEventName,
  type UsageEventPayload,
  type UsageLocale,
  type UsageStatus,
} from './types';

const MAX_TEXT_LENGTH = 220;
const MAX_KEY_LENGTH = 64;
const MAX_ARRAY_ITEMS = 24;
const MAX_OBJECT_KEYS = 48;
const MAX_DEPTH = 4;

const eventNameSet = new Set<string>(usageEventNames);
const localeSet = new Set<string>(usageLocales);
const statusSet = new Set<string>(usageStatuses);

export function parseUsageEventPayload(value: unknown): UsageEventPayload | null {
  if (!isRecord(value)) return null;

  const eventName = readEnum<UsageEventName>(value.eventName, eventNameSet);
  const area = readText(value.area, 80);
  if (!eventName || !area) return null;

  const status = readEnum<UsageStatus>(value.status, statusSet);
  const locale = readEnum<UsageLocale>(value.locale, localeSet);
  const payload = sanitizeRecord(value.payload);
  const result = sanitizeRecord(value.result);

  return {
    eventName,
    area,
    status,
    locale,
    path: readText(value.path, 240),
    referrer: readText(value.referrer, 300),
    sessionId: readText(value.sessionId, 120),
    payload,
    result,
  };
}

function readEnum<T extends string>(value: unknown, allowed: Set<string>): T | undefined {
  if (typeof value !== 'string' || !allowed.has(value)) return undefined;
  return value as T;
}

function readText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function sanitizeRecord(value: unknown): Record<string, unknown> | undefined {
  const sanitized = sanitizeJson(value, 0);
  return isRecord(sanitized) ? sanitized : undefined;
}

function sanitizeJson(value: unknown, depth: number): unknown {
  if (value === null || typeof value === 'boolean') return value;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    return value.slice(0, MAX_TEXT_LENGTH);
  }

  if (Array.isArray(value)) {
    if (depth >= MAX_DEPTH) return [];
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((item) => sanitizeJson(item, depth + 1))
      .filter((item) => item !== undefined);
  }

  if (isRecord(value)) {
    if (depth >= MAX_DEPTH) return {};
    const entries = Object.entries(value)
      .slice(0, MAX_OBJECT_KEYS)
      .flatMap(([key, item]) => {
        const safeKey = key.slice(0, MAX_KEY_LENGTH);
        const safeValue = sanitizeJson(item, depth + 1);
        return safeValue === undefined ? [] : [[safeKey, safeValue] as const];
      });
    return Object.fromEntries(entries);
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
