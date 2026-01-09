'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/slug';
import { ensureAuth } from './utils';

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
    seo_title: null,
    seo_description: null,
    published,
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select();

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating post:', error);
    }
    redirect(`/admin/posts/new?error=create_failed&message=${encodeURIComponent(error.message)}`);
  }

  if (!data || data.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Post created but no data returned');
    }
    redirect('/admin/posts/new?error=create_failed&message=Post created but not found');
  }

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
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
