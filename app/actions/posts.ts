'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth } from '@/lib/auth';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seo_title: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

async function ensureAuth() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}

// Получить все посты (только для админа)
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  return data || [];
}

// Получить только опубликованные посты (для публичной страницы)
export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  return data || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data;
}

export async function createPost(formData: FormData) {
  await ensureAuth();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const seo_title = formData.get('seo_title') as string;
  const published = formData.get('published') === 'true';

  if (!title || !content) {
    return { error: 'Title and content are required' };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      slug,
      content,
      excerpt: excerpt || '',
      seo_title: seo_title || title,
      published,
    })
    .select()
    .single();

  if (error) {
    return { error: `Failed to create post: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath(`/blog/${slug}`);
  return { success: true, data };
}

export async function updatePost(id: string, formData: FormData) {
  await ensureAuth();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const seo_title = formData.get('seo_title') as string;
  const published = formData.get('published') === 'true';

  if (!title || !content) {
    return { error: 'Title and content are required' };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      slug,
      content,
      excerpt: excerpt || '',
      seo_title: seo_title || title,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: `Failed to update post: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath(`/blog/${slug}`);
  return { success: true, data };
}

export async function deletePost(id: string) {
  await ensureAuth();

  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    return { error: `Failed to delete post: ${error.message}` };
  }

  revalidatePath('/');
  return { success: true };
}

