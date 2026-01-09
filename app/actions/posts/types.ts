export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_title_en: string | null;
  seo_description_en: string | null;
  seo_title_ru: string | null;
  seo_description_ru: string | null;
  translated_content_ru: string | null;
  translated_content_en: string | null;
  translated_excerpt_ru: string | null;
  translated_excerpt_en: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
