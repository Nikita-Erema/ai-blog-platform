'use server';

import { openai } from '@/lib/openai/server';
import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ensureAuth } from './utils';

export async function rewriteContent(content: string, instruction: string): Promise<string> {
  await ensureAuth();

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional content editor. Rewrite the provided content according to the user\'s instructions while maintaining the original meaning and style.',
        },
        {
          role: 'user',
          content: `Content to rewrite:\n\n${content}\n\nInstruction: ${instruction}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || content;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error rewriting content:', error);
    }
    throw new Error('Failed to rewrite content');
  }
}

export async function rewritePostAction(postId: string, content: string): Promise<string> {
  await ensureAuth();

  if (!content || !content.trim()) {
    throw new Error('Content is required');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional content editor. Rewrite the provided blog post content to make it clearer and more professional while maintaining the exact same meaning. Preserve the original structure including headings, paragraphs, and formatting. Do not add any markdown that was not in the original. Output in English.',
        },
        {
          role: 'user',
          content: `Rewrite this blog post content to be clearer and more professional:\n\n${content}`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const rewrittenContent = response.choices[0]?.message?.content?.trim() || content;

    const { error } = await supabase
      .from('posts')
      .update({ content: rewrittenContent })
      .eq('id', postId);

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }

    revalidatePath(`/admin/posts/${postId}/edit`);
    revalidatePath('/admin/posts');
    revalidatePath('/blog');

    return rewrittenContent;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error rewriting post:', error);
    }
    throw new Error('Failed to rewrite post content');
  }
}
