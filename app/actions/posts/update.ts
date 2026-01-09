'use server';

import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/slug';
import { ensureAuth } from './utils';

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
  const seo_title = (formData.get('seo_title') as string) || null;
  const seo_description = (formData.get('seo_description') as string) || null;

  const { error } = await supabase
    .from('posts')
    .update({
      title: title.trim(),
      slug: normalizedSlug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      seo_title: seo_title?.trim() || null,
      seo_description: seo_description?.trim() || null,
      updated_at: new Date().toISOString(),
      published,
    })
    .eq('id', id);

  if (error) {
    redirect(`/admin/posts/${id}/edit?error=update_failed&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/posts');
  revalidatePath('/blog');
  revalidatePath(`/blog/${normalizedSlug}`);
  redirect('/admin/posts');
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
      updated_at: new Date().toISOString(),
      published,
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
