-- Add translated content columns to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translated_content_ru TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translated_content_en TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translated_excerpt_ru TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS translated_excerpt_en TEXT;
