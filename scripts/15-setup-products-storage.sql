-- Create storage bucket for product images and fix RLS policies

-- 1. Create products storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing storage policies for products bucket
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- 3. Create storage policies for products bucket
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- 4. Ensure products table RLS policies exist for admins
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- 5. Grant permissions
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

-- Verification query
SELECT 
  'Storage bucket check:' as test,
  id,
  name,
  public as is_public
FROM storage.buckets
WHERE id = 'products';
