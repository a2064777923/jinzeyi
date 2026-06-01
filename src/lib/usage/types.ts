export const usageEventNames = ['page_view', 'tool_submit', 'tool_error', 'almanac_search'] as const;
export type UsageEventName = (typeof usageEventNames)[number];

export const usageStatuses = ['success', 'error'] as const;
export type UsageStatus = (typeof usageStatuses)[number];

export const usageLocales = ['zh-hans', 'zh-hant'] as const;
export type UsageLocale = (typeof usageLocales)[number];

export interface UsageEventPayload {
  eventName: UsageEventName;
  area: string;
  status?: UsageStatus;
  locale?: UsageLocale;
  path?: string;
  referrer?: string;
  sessionId?: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
}
