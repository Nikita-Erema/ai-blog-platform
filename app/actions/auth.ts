'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { removeAdminAuth, verifyAdminPassword } from '@/lib/auth';

const ADMIN_COOKIE_NAME = 'admin-auth';

function buildLoginUrl(redirectTo: string | null, error: string): string {
  const params = new URLSearchParams();
  if (redirectTo) {
    params.set('redirect', redirectTo);
  }
  params.set('error', error);
  return `/admin/login?${params.toString()}`;
}

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect') as string | null;

  // Проверка наличия пароля
  if (!password || !password.trim()) {
    redirect(buildLoginUrl(redirectTo, 'password_required'));
  }

  // Проверка пароля
  let isValid: boolean = false;
  try {
    isValid = await verifyAdminPassword(password);
  } catch (error) {
    // Если ADMIN_PASSWORD не настроен
    console.error('Auth error:', error);
    redirect(buildLoginUrl(redirectTo, 'config_error'));
  }

  // Проверка результата
  if (!isValid) {
    redirect(buildLoginUrl(redirectTo, 'invalid_password'));
  }

  // Установка cookie напрямую в Server Action
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  });

  // Redirect после установки cookie
  redirect(redirectTo || '/admin');
}

export async function logoutAction() {
  await removeAdminAuth();
  redirect('/admin/login');
}

