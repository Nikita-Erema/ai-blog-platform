'use server';

import { openai } from '@/lib/openai/server';
import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { ensureAuth } from './utils';

export async function generatePostContentAction(postId: string, title: string): Promise<string> {
  await ensureAuth();

  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional blog post writer. Generate a full blog post based on the given title. The post should have a clear structure with an introduction, body paragraphs, and a conclusion. Write 4-6 paragraphs. Use a neutral, informative tone. Be factual and educational. Avoid marketing language, emojis, and unnecessary markdown lists. Output in English only.',
        },
        {
          role: 'user',
          content: `Generate a full blog post for this title: ${title}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const generatedContent = response.choices[0]?.message?.content?.trim() || '';

    if (!generatedContent) {
      throw new Error('Failed to generate content');
    }

    const { error } = await supabase
      .from('posts')
      .update({ content: generatedContent })
      .eq('id', postId);

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }

    revalidatePath(`/admin/posts/${postId}/edit`);
    revalidatePath('/admin/posts');
    revalidatePath('/blog');

    return generatedContent;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating post content:', error);
    }
    throw new Error('Failed to generate post content');
  }
}
