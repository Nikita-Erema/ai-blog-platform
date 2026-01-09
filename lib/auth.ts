import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin-auth';


export async function setAdminAuth() {
  const cookieStore = await cookies();
  // На Vercel всегда используем secure: true (HTTPS)
  // VERCEL === '1' автоматически устанавливается Vercel
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
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

  if (!ADMIN_PASSWORD || !ADMIN_PASSWORD.trim()) {
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL === '1') {
      console.error('ADMIN_PASSWORD is not set in environment variables');
    }
    throw new Error('ADMIN_PASSWORD not configured');
  }

  const trimmedPassword = password?.trim() || '';
  const trimmedAdminPassword = ADMIN_PASSWORD.trim();

  return trimmedPassword === trimmedAdminPassword;
}

