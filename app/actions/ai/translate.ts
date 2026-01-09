'use server';

import { openai } from '@/lib/openai/server';
import { supabase } from '@/lib/supabase/server';

export async function translatePost(
  postId: string,
  content: string,
  targetLang: 'en' | 'ru'
): Promise<string> {
  if (!content || !content.trim()) {
    throw new Error('Content is required');
  }

  const { data: post } = await supabase
    .from('posts')
    .select('translated_content_en, translated_content_ru')
    .eq('id', postId)
    .single();

  if (post) {
    const cachedContent = targetLang === 'ru' ? post.translated_content_ru : post.translated_content_en;
    if (cachedContent) {
      return cachedContent;
    }
  }

  try {
    const targetLanguage = targetLang === 'ru' ? 'Russian' : 'English';
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the provided blog post content to ${targetLanguage}. Preserve all HTML tags, markdown formatting, and structure exactly as they appear. Only translate the text content, not the markup. Maintain the same tone and style as the original.`,
        },
        {
          role: 'user',
          content: `Translate this blog post content to ${targetLanguage}:\n\n${content}`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const translatedContent = response.choices[0]?.message?.content?.trim() || content;

    const updateData = targetLang === 'ru' 
      ? { translated_content_ru: translatedContent }
      : { translated_content_en: translatedContent };

    await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId);

    return translatedContent;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error translating post:', error);
    }
    throw new Error('Failed to translate post');
  }
}

export async function translateExcerpt(
  postId: string,
  excerpt: string,
  targetLang: 'en' | 'ru'
): Promise<string> {
  if (!excerpt || !excerpt.trim()) {
    return excerpt;
  }

  const { data: post } = await supabase
    .from('posts')
    .select('translated_excerpt_en, translated_excerpt_ru')
    .eq('id', postId)
    .single();

  if (post) {
    const cachedExcerpt = targetLang === 'ru' ? post.translated_excerpt_ru : post.translated_excerpt_en;
    if (cachedExcerpt) {
      return cachedExcerpt;
    }
  }

  try {
    const targetLanguage = targetLang === 'ru' ? 'Russian' : 'English';
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the provided blog post excerpt to ${targetLanguage}. Maintain the same tone and style as the original. Output plain text only, no markdown.`,
        },
        {
          role: 'user',
          content: `Translate this blog post excerpt to ${targetLanguage}:\n\n${excerpt}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const translatedExcerpt = response.choices[0]?.message?.content?.trim() || excerpt;

    const updateData = targetLang === 'ru'
      ? { translated_excerpt_ru: translatedExcerpt }
      : { translated_excerpt_en: translatedExcerpt };

    await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId);

    return translatedExcerpt;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error translating excerpt:', error);
    }
    throw new Error('Failed to translate excerpt');
  }
}
