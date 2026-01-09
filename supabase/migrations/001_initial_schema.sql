-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  seo_title TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published posts
CREATE POLICY "Public can view published posts"
  ON posts
  FOR SELECT
  USING (published = true);

-- Policy: Allow all operations (admin auth is handled by Next.js middleware)
-- Since we use cookie-based auth in Next.js, not Supabase auth,
-- we need to allow all operations here. The middleware protects admin routes.
CREATE POLICY "Allow all operations"
  ON posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

