-- Add seo_description column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_description TEXT;
