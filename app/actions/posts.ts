'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

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

// Получить статистику постов (только для админа)
export async function getPostStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
}> {
  await ensureAuth();

  const { data, error } = await supabase
    .from('posts')
    .select('published');

  if (error) {
    throw new Error(`Failed to fetch post stats: ${error.message}`);
  }

  const total = data?.length || 0;
  const published = data?.filter((p) => p.published).length || 0;
  const drafts = total - published;

  return { total, published, drafts };
}

// Получить все посты (только для админа)
export async function getPosts(): Promise<Post[]> {
  await ensureAuth();

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
  const normalizedSlug = generateSlug(slug);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', normalizedSlug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  if (!data.published) {
    return null;
  }

  return data;
}

export async function getPostById(id: string): Promise<Post | null> {
  await ensureAuth();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    if (error.message?.includes('invalid input syntax for type uuid') || error.code === '22P02') {
      return null;
    }
    throw new Error(`Failed to fetch post: ${error.message}`);
  }

  return data || null;
}

export async function createPostAction(formData: FormData) {
  await ensureAuth();

  const title = formData.get('title') as string;
  const content = (formData.get('content') as string) || '';
  const slugInput = (formData.get('slug') as string) || '';
  const published = formData.get('published') === 'on';

  if (!title || !title.trim()) {
    redirect('/admin/posts/new?error=title_required');
  }

  const slug = slugInput.trim() ? generateSlug(slugInput) : generateSlug(title);

  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existingPost) {
    redirect('/admin/posts/new?error=slug_exists');
  }

  const insertData = {
    title: title.trim(),
    slug,
    content: content.trim() || '',
    excerpt: '',
    seo_title: title.trim(),
    published,
  };

  console.log('Creating post with data:', { ...insertData, content: insertData.content.substring(0, 50) + '...' });

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select();

  if (error) {
    console.error('Error creating post:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    redirect(`/admin/posts/new?error=create_failed&message=${encodeURIComponent(error.message)}`);
  }

  console.log('Post created successfully:', data?.[0]?.id);

  if (!data || data.length === 0) {
    console.error('Post created but no data returned');
    redirect('/admin/posts/new?error=create_failed&message=Post created but not found');
  }

  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}

export async function updatePostAction(id: string, formData: FormData) {
  await ensureAuth();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  if (!title || !title.trim()) {
    redirect(`/admin/posts/${id}/edit?error=title_required`);
  }

  if (!slug || !slug.trim()) {
    redirect(`/admin/posts/${id}/edit?error=slug_required`);
  }

  if (!content || !content.trim()) {
    redirect(`/admin/posts/${id}/edit?error=content_required`);
  }

  const normalizedSlug = generateSlug(slug);

  const { data: currentPost } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .single();

  if (currentPost && currentPost.slug !== normalizedSlug) {
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', normalizedSlug)
      .neq('id', id)
      .maybeSingle();

    if (existingPost) {
      redirect(`/admin/posts/${id}/edit?error=slug_exists`);
    }
  }

  const excerpt = (formData.get('excerpt') as string) || '';

  const { error } = await supabase
    .from('posts')
    .update({
      title: title.trim(),
      slug: normalizedSlug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      updated_at: new Date().toISOString(),
      published,
    })
    .eq('id', id);

  if (error) {
    redirect(`/admin/posts/${id}/edit?error=update_failed&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/posts');
  redirect('/admin/posts');
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

  const slug = generateSlug(title);

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

  const slug = generateSlug(title);

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
  revalidatePath('/');
}

