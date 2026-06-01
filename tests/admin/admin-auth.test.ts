import { describe, expect, it, vi } from 'vitest';
import { verifyAdminCredentials, verifyAdminSessionToken } from '@/lib/admin/auth';

const ORIGINAL_ENV = process.env;

function withEnv(env: Partial<NodeJS.ProcessEnv>, fn: () => void) {
  process.env = { ...ORIGINAL_ENV, ...env };
  try {
    fn();
  } finally {
    process.env = ORIGINAL_ENV;
  }
}

describe('admin auth', () => {
  it('requires configured password for admin login', () => {
    withEnv({ ADMIN_USERNAME: 'owner', ADMIN_PASSWORD: 'secret' }, () => {
      expect(verifyAdminCredentials('owner', 'secret')).toBe(true);
      expect(verifyAdminCredentials('owner', 'bad')).toBe(false);
      expect(verifyAdminCredentials('admin', 'secret')).toBe(false);
    });
  });

  it('rejects login when no password is configured', () => {
    withEnv({ ADMIN_USERNAME: 'owner', ADMIN_PASSWORD: '' }, () => {
      expect(verifyAdminCredentials('owner', '')).toBe(false);
    });
  });

  it('rejects missing or malformed sessions', () => {
    withEnv({ ADMIN_SESSION_SECRET: 'session-secret' }, () => {
      expect(verifyAdminSessionToken(undefined)).toBeNull();
      expect(verifyAdminSessionToken('bad-token')).toBeNull();
    });
  });

  it('rejects expired sessions', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-02T00:00:00Z'));
    const { createHmac } = await import('node:crypto');

    withEnv({ ADMIN_SESSION_SECRET: 'session-secret' }, () => {
      const encoded = Buffer.from(JSON.stringify({
        username: 'admin',
        expiresAt: Date.now() - 1,
      })).toString('base64url');
      const signature = createHmac('sha256', 'session-secret').update(encoded).digest('base64url');
      expect(verifyAdminSessionToken(`${encoded}.${signature}`)).toBeNull();
    });

    vi.useRealTimers();
  });
});
