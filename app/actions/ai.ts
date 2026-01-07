'use server';

import { openai } from '@/lib/openai/server';
import { checkAdminAuth } from '@/lib/auth';

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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates concise, engaging excerpts for blog posts. Generate a 2-3 sentence excerpt that summarizes the main points and entices readers.',
        },
        {
          role: 'user',
          content: `Create an excerpt for this blog post content:\n\n${content.substring(0, 2000)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating excerpt:', error);
    throw new Error('Failed to generate excerpt');
  }
}

export async function generateSEOTitle(title: string, content: string): Promise<string> {
  await ensureAuth();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
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

