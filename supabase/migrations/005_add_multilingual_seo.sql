-- Add multilingual SEO columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title_en TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description_en TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title_ru TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description_ru TEXT;
