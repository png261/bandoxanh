-- Disable RLS on storage.objects table to allow public uploads
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Optional: If you want to keep RLS but allow public uploads, use this instead:
-- DROP POLICY IF EXISTS "Public storage access" ON storage.objects;
-- CREATE POLICY "Public storage access"
--   ON storage.objects FOR ALL
--   USING (bucket_id = 'bandoxanh')
--   WITH CHECK (bucket_id = 'bandoxanh');

-- Disable RLS on storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
