import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin-auth';


export async function setAdminAuth() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // В production требует HTTPS
    sameSite: 'lax', // 'lax' работает лучше с redirect, чем 'strict'
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  });
}

export async function removeAdminAuth() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return authCookie?.value === 'authenticated';
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not set in environment variables');
    throw new Error('ADMIN_PASSWORD not configured');
  }

  return password.trim() === ADMIN_PASSWORD.trim();
}

