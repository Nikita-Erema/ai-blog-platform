import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Разрешаем доступ к странице логина без проверки
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Проверяем админскую cookie и её значение
  const authCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const isAuthenticated = authCookie?.value === 'authenticated';

  // Если нет авторизации и это админка — редирект на логин
  if (pathname.startsWith('/admin') && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    // Сохраняем текущий путь для редиректа после логина
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Во всех остальных случаях — пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
