-- QUICK FIX: Run this entire script in Supabase SQL Editor to fix upload errors
-- This combines all necessary fixes in one script

-- 1. Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view category images" ON public.category_images;
DROP POLICY IF EXISTS "Anyone can view active category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can insert category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can update category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can delete category images" ON public.category_images;

-- 3. Create new RLS policies for category_images table
CREATE POLICY "Public can view category images"
  ON public.category_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admins can insert"
  ON public.category_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can update"
  ON public.category_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can delete"
  ON public.category_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- 4. Grant permissions
GRANT ALL ON public.category_images TO authenticated;
GRANT ALL ON public.category_images TO service_role;

-- 5. Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Fix storage policies
DROP POLICY IF EXISTS "Public can view category images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete category images" ON storage.objects;

CREATE POLICY "Public can view category images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated can upload category images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'category-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can update storage"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'category-images'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'category-images'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- 7. Verify admin user
UPDATE public.users 
SET role = 'admin'
WHERE email = 'jibreel@studo.ps'
  AND role IS NULL OR role != 'admin';

-- 8. Test query (should return true)
SELECT 
  'Admin check:' as test,
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN '✓ Admin access confirmed'
    ELSE '✗ Not an admin'
  END as status
FROM public.users
WHERE email = 'jibreel@studo.ps';
