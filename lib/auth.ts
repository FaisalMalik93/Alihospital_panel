import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  username: string;
  role: string;
}

const SESSION_COOKIE_NAME = 'session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(sessionData: SessionData): Promise<void> {
  const sessionString = JSON.stringify(sessionData);
  const encodedSession = Buffer.from(sessionString).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionString = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const sessionData = JSON.parse(sessionString) as SessionData;
    return sessionData;
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await requireAuth();
  if (session.role !== 'Admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}
