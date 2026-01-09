'use server';

import { supabase } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/slug';
import type { Post } from './types';
import { ensureAuth } from './utils';

export async function getPostStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
}> {
  await ensureAuth();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('published');

    if (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error';
      throw new Error(`Failed to fetch post stats: ${errorMessage}`);
    }

    const total = data?.length || 0;
    const published = data?.filter((p) => p.published).length || 0;
    const drafts = total - published;

    return { total, published, drafts };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMessage = error?.toString() || 'Unknown error';
    throw new Error(`Failed to fetch post stats: ${errorMessage}`);
  }
}

export async function getPosts(): Promise<Post[]> {
  await ensureAuth();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error';
      throw new Error(`Failed to fetch posts: ${errorMessage}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMessage = error?.toString() || 'Unknown error';
    throw new Error(`Failed to fetch posts: ${errorMessage}`);
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error';
      throw new Error(`Failed to fetch posts: ${errorMessage}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMessage = error?.toString() || 'Unknown error';
    throw new Error(`Failed to fetch posts: ${errorMessage}`);
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const normalizedSlug = generateSlug(slug);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', normalizedSlug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error';
      throw new Error(`Failed to fetch post: ${errorMessage}`);
    }

    if (!data) {
      return null;
    }

    if (!data.published) {
      return null;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMessage = error?.toString() || 'Unknown error';
    throw new Error(`Failed to fetch post: ${errorMessage}`);
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  await ensureAuth();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      if (error.message?.includes('invalid input syntax for type uuid') || error.code === '22P02') {
        return null;
      }
      const errorMessage = error.message || error.toString() || 'Unknown error';
      throw new Error(`Failed to fetch post: ${errorMessage}`);
    }

    return data || null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const errorMessage = error?.toString() || 'Unknown error';
    throw new Error(`Failed to fetch post: ${errorMessage}`);
  }
}
