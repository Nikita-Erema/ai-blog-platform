'use server';

import { openai } from '@/lib/openai/server';
import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ensureAuth } from './utils';

export async function generateExcerpt(content: string): Promise<string> {
  await ensureAuth();

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates concise, engaging excerpts for blog posts. Generate a 2-3 sentence excerpt that summarizes the main points and entices readers. Output plain text only, no markdown.',
        },
        {
          role: 'user',
          content: `Create an excerpt for this blog post content (max 300 characters):\n\n${content.substring(0, 2000)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const excerpt = response.choices[0]?.message?.content?.trim() || '';
    return excerpt.length > 300 ? excerpt.substring(0, 297) + '...' : excerpt;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating excerpt:', error);
    }
    throw new Error('Failed to generate excerpt');
  }
}

export async function generateExcerptAction(postId: string, content: string): Promise<string> {
  await ensureAuth();

  if (!content || !content.trim()) {
    throw new Error('Content is required');
  }

  const excerpt = await generateExcerpt(content);

  const { error } = await supabase
    .from('posts')
    .update({ excerpt })
    .eq('id', postId);

  if (error) {
    throw new Error(`Failed to update excerpt: ${error.message}`);
  }

  revalidatePath(`/admin/posts/${postId}/edit`);
  revalidatePath('/admin/posts');
  revalidatePath('/blog');

  return excerpt;
}
