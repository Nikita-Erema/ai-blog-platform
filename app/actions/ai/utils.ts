'use server';

import { checkAdminAuth } from '@/lib/auth';

export async function ensureAuth() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}
