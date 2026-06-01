import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'jinzeyi_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface AdminSession {
  username: string;
  expiresAt: number;
}

interface SessionPayload {
  username: string;
  expiresAt: number;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export async function createAdminSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken({ username, expiresAt }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) return false;
  return safeEqual(username.trim(), expectedUsername) && safeEqual(password, expectedPassword);
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  const secret = readAdminSessionSecret();
  if (!token || !secret) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expectedSignature = sign(encoded, secret);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.username || !payload.expiresAt || payload.expiresAt <= Date.now()) return null;
    return { username: payload.username, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}

function createAdminSessionToken(payload: SessionPayload): string {
  const secret = readAdminSessionSecret();
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required for admin sessions');
  }

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

function readAdminSessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET || process.env.USAGE_HASH_SALT;
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
