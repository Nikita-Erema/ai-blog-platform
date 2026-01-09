'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ensureAuth } from './utils';

export async function deletePostAction(id: string) {
  await ensureAuth();

  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Post not found');
  }

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  revalidatePath('/');
}
