'use server';

import { openai } from '@/lib/openai/server';
import { supabase } from '@/lib/supabase/server';

export async function generateMultilingualSeo(
  postId: string,
  title: string,
  content: string,
  lang: 'en' | 'ru'
): Promise<{ seo_title: string; seo_description: string }> {
  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }

  if (!content || !content.trim()) {
    throw new Error('Content is required');
  }

  const titleColumn = lang === 'ru' ? 'seo_title_ru' : 'seo_title_en';
  const descColumn = lang === 'ru' ? 'seo_description_ru' : 'seo_description_en';

  const { data: post } = await supabase
    .from('posts')
    .select('seo_title_en, seo_description_en, seo_title_ru, seo_description_ru')
    .eq('id', postId)
    .single();

  if (post) {
    const titleValue = lang === 'ru' ? post.seo_title_ru : post.seo_title_en;
    const descValue = lang === 'ru' ? post.seo_description_ru : post.seo_description_en;
    
    if (titleValue && descValue) {
      return {
        seo_title: titleValue,
        seo_description: descValue,
      };
    }
  }

  try {
    const targetLanguage = lang === 'ru' ? 'Russian' : 'English';
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            `You are an SEO expert writing metadata for a technical blog in ${targetLanguage}.\n\nTASK:\nGenerate an SEO title and meta description for a blog post.\n\nRULES FOR SEO TITLE:\n- Start with the main search query.\n- Use the format: "What Is X?" or "What Is X and Y".\n- Maximum length: 60 characters.\n- Clear, literal, search-focused wording.\n- NO marketing language.\n- Do NOT use words like: Discover, Ultimate, Guide, Overview, Understanding.\n- Capitalize important words.\n\nRULES FOR META DESCRIPTION:\n- Maximum length: 160 characters.\n- Clearly summarize what the article explains.\n- Use factual, neutral language.\n- Do NOT hype or promote.\n- Mention key concepts found in the content.\n- Do NOT invent information not present in the text.\n\nOUTPUT FORMAT (strict JSON):\n{\n  "seo_title": "...",\n  "seo_description": "..."\n}`,
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.substring(0, 2000)}\n\nGenerate SEO title (max 60 chars) and meta description (max 160 chars) in ${targetLanguage} based strictly on this content.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    const result = response.choices[0]?.message?.content?.trim() || '';
    let parsed: { seo_title?: string; seo_description?: string };

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        const lines = result.split('\n');
        const titleMatch = lines.find((line) => line.toLowerCase().includes('title'));
        const descMatch = lines.find((line) => line.toLowerCase().includes('description'));
        parsed = {
          seo_title: titleMatch ? titleMatch.split(':').slice(1).join(':').trim() : undefined,
          seo_description: descMatch ? descMatch.split(':').slice(1).join(':').trim() : undefined,
        };
      }
    } catch {
      const lines = result.split('\n').filter((line) => line.trim());
      parsed = {
        seo_title: lines[0]?.trim(),
        seo_description: lines.slice(1).join(' ').trim(),
      };
    }

    const seo_title = (parsed.seo_title || title).trim().substring(0, 60);
    const seo_description = (parsed.seo_description || '').trim().substring(0, 160);

    const updateData = lang === 'ru'
      ? { seo_title_ru: seo_title, seo_description_ru: seo_description }
      : { seo_title_en: seo_title, seo_description_en: seo_description };

    await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId);

    return { seo_title, seo_description };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating multilingual SEO:', error);
    }
    throw new Error('Failed to generate multilingual SEO');
  }
}
