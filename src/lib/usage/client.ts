'use client';

import type { UsageEventPayload, UsageLocale, UsageStatus } from './types';

const SESSION_KEY = 'jinzeyi_usage_session_v1';

interface ToolUsageInput {
  tool: string;
  locale?: UsageLocale;
  status: UsageStatus;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export function recordToolUsage(input: ToolUsageInput): void {
  recordUsageEvent({
    eventName: input.status === 'success' ? 'tool_submit' : 'tool_error',
    area: input.tool,
    locale: input.locale,
    status: input.status,
    payload: input.payload,
    result: input.result,
  });
}

export function recordUsageEvent(input: UsageEventPayload): void {
  if (typeof window === 'undefined') return;

  const payload: UsageEventPayload = {
    ...input,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
  };
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/usage', blob);
    return;
  }

  void fetch('/api/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Usage tracking must never break the calculator flow.
  });
}

function getSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const next = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return '';
  }
}
