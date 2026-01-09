'use server';

import { openai } from '@/lib/openai/server';
import { checkAdminAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function ensureAuth() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}

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
    console.error('Error generating excerpt:', error);
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

  return excerpt;
}

export async function generateSEOTitle(title: string, content: string): Promise<string> {
  await ensureAuth();

  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO expert. Generate an optimized title (50-60 characters) that is SEO-friendly, includes relevant keywords, and is compelling for search engines and readers.',
        },
        {
          role: 'user',
          content: `Original title: ${title}\n\nContent: ${content.substring(0, 1000)}\n\nGenerate an SEO-optimized title.`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || title;
  } catch (error) {
    console.error('Error generating SEO title:', error);
    throw new Error('Failed to generate SEO title');
  }
}

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
    console.error('Error rewriting content:', error);
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

    return rewrittenContent;
  } catch (error) {
    console.error('Error rewriting post:', error);
    throw new Error('Failed to rewrite post content');
  }
}

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

    return generatedContent;
  } catch (error) {
    console.error('Error generating post content:', error);
    throw new Error('Failed to generate post content');
  }
}
