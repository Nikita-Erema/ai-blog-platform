'use server';

import { redirect } from 'next/navigation';
import { setAdminAuth, removeAdminAuth, verifyAdminPassword } from '@/lib/auth';

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL === '1') {
      console.error('Auth error:', errorMessage);
    }
    redirect(buildLoginUrl(redirectTo, 'config_error'));
  }

  // Проверка результата
  if (!isValid) {
    redirect(buildLoginUrl(redirectTo, 'invalid_password'));
  }

  // Установка cookie через функцию
  try {
    await setAdminAuth();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL === '1') {
      console.error('Error setting auth cookie:', errorMessage);
    }
    redirect(buildLoginUrl(redirectTo, 'config_error'));
  }

  // Redirect после установки cookie
  redirect(redirectTo || '/admin');
}

export async function logoutAction() {
  await removeAdminAuth();
  redirect('/admin/login');
}

