-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
DROP POLICY IF EXISTS "Allow all operations" ON posts;

-- Policy: Allow public read access to published posts
CREATE POLICY "Public can view published posts"
  ON posts
  FOR SELECT
  USING (published = true);

-- Policy: Allow INSERT for all (since we use cookie-based auth in Next.js)
CREATE POLICY "Allow INSERT"
  ON posts
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow UPDATE for all
CREATE POLICY "Allow UPDATE"
  ON posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow DELETE for all
CREATE POLICY "Allow DELETE"
  ON posts
  FOR DELETE
  USING (true);

-- Policy: Allow SELECT for all (admin needs to see drafts)
CREATE POLICY "Allow SELECT for all"
  ON posts
  FOR SELECT
  USING (true);
