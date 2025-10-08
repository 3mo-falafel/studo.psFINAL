-- Fix RLS policies to allow admin users full access to all tables
-- This script adds admin policies for categories, products, banners, orders, and users

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- BANNERS POLICIES (Fix for admin CRUD)
-- ============================================

-- Drop existing banner policies
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

-- Recreate with better policies
CREATE POLICY "Anyone can view banners" ON public.banners
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert banners" ON public.banners
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update banners" ON public.banners
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete banners" ON public.banners
  FOR DELETE USING (is_admin());

-- ============================================
-- CATEGORIES POLICIES (Admin CRUD)
-- ============================================

-- Drop existing
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;

-- Recreate
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCTS POLICIES (Admin CRUD)
-- ============================================

-- Drop existing
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Recreate
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (is_admin());

-- ============================================
-- ORDERS POLICIES (Admin can view all)
-- ============================================

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (is_admin());

-- ============================================
-- ORDER ITEMS POLICIES (Admin can view all)
-- ============================================

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (is_admin());

-- ============================================
-- USERS POLICIES (Admin can view/update all)
-- ============================================

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (is_admin());

-- ============================================
-- BLOG POSTS POLICIES (Admin CRUD)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE USING (is_admin());

-- ============================================
-- CONTACT MESSAGES POLICIES (Admin can view all)
-- ============================================

CREATE POLICY "Admins can view all contact messages" ON public.contact_messages
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE USING (is_admin());

-- ============================================
-- STORAGE POLICIES (For banner images)
-- ============================================

-- Create the banners bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

CREATE POLICY "Anyone can view banner images" ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banner images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'banners' AND is_admin());

CREATE POLICY "Admins can update banner images" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'banners' AND is_admin());

CREATE POLICY "Admins can delete banner images" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'banners' AND is_admin());
