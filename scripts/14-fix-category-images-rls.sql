-- Fix RLS policies for category_images table
-- This script ensures admin users can upload and manage category images

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can insert category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can update category images" ON public.category_images;
DROP POLICY IF EXISTS "Admins can delete category images" ON public.category_images;

-- Recreate the is_admin() helper function if it doesn't exist
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

-- Create RLS policies for category_images
CREATE POLICY "Anyone can view active category images"
  ON public.category_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert category images"
  ON public.category_images
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update category images"
  ON public.category_images
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete category images"
  ON public.category_images
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Ensure storage bucket exists for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view category images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete category images" ON storage.objects;

-- Create storage policies for category-images bucket
CREATE POLICY "Anyone can view category images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'category-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can update category images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'category-images'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete category images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'category-images'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.category_images TO authenticated;
GRANT ALL ON public.category_images TO service_role;

-- Verify the admin user exists and has correct role
DO $$
DECLARE
  admin_email TEXT := 'jibreel@studo.ps';
  admin_user_id UUID;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- Update their role in users table if they exist
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.users
    SET role = 'admin'
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Admin role confirmed for user: %', admin_email;
  ELSE
    RAISE NOTICE 'Admin user not found: %', admin_email;
  END IF;
END $$;

-- Test the is_admin() function
SELECT 
  email,
  role,
  is_admin() as has_admin_access
FROM public.users
WHERE email = 'jibreel@studo.ps';
