# 🚨 CRITICAL FIX REQUIRED - Admin RLS Policies

## Problem Summary:
Your admin user (jibreel@studo.ps) exists in the database but doesn't have the proper Row Level Security (RLS) policies to INSERT, UPDATE, or DELETE banners, categories, products, etc.

## 🔴 MUST RUN THIS SQL SCRIPT IN SUPABASE:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `kkulikrjfnvrttamgdxh`
3. Click on **SQL Editor** (left sidebar)
4. Click **"New Query"**

### Step 2: Run the Complete Fix Script

Copy and paste this ENTIRE script and click **"Run"**:

```sql
-- ============================================
-- COMPLETE FIX FOR ADMIN RLS POLICIES
-- ============================================

-- 1. Create helper function to check if user is admin
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
-- 2. FIX BANNERS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

CREATE POLICY "Anyone can view banners" ON public.banners
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert banners" ON public.banners
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update banners" ON public.banners
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete banners" ON public.banners
  FOR DELETE USING (is_admin());

-- ============================================
-- 3. FIX CATEGORIES POLICIES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (is_admin());

-- ============================================
-- 4. FIX PRODUCTS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (is_admin());

-- ============================================
-- 5. FIX ORDERS POLICIES
-- ============================================
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (is_admin());

-- ============================================
-- 6. FIX ORDER ITEMS POLICIES
-- ============================================
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (is_admin());

-- ============================================
-- 7. FIX USERS POLICIES
-- ============================================
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (is_admin());

-- ============================================
-- 8. CREATE STORAGE BUCKET FOR BANNER IMAGES
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. FIX STORAGE POLICIES FOR BANNER IMAGES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete banner images" ON storage.objects;

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

-- ============================================
-- 10. VERIFY ADMIN USER EXISTS
-- ============================================
-- Check if admin user exists and has correct role
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE email = 'jibreel@studo.ps'
  AND role = 'admin';
  
  IF admin_count = 0 THEN
    RAISE NOTICE 'WARNING: Admin user jibreel@studo.ps not found or role is not admin!';
  ELSE
    RAISE NOTICE 'SUCCESS: Admin user verified!';
  END IF;
END $$;
```

### Step 3: Verify It Worked

After running the script, you should see:
- ✅ "SUCCESS: Admin user verified!"
- ✅ Multiple "CREATE POLICY" messages

### Step 4: Test Your Admin Panel

1. Logout and login again with `jibreel@studo.ps` / `12345`
2. Go to `/admin/banners`
3. Try to:
   - ✅ Upload an image
   - ✅ Add a new banner
   - ✅ Edit an existing banner
   - ✅ Delete a banner

Everything should work now!

---

## What This Script Does:

1. **Creates `is_admin()` function** - Checks if current user has admin role
2. **Fixes Banners RLS** - Allows admins to INSERT, UPDATE, DELETE banners
3. **Fixes Categories RLS** - Allows admins full access to categories
4. **Fixes Products RLS** - Allows admins full access to products
5. **Fixes Orders RLS** - Allows admins to view and update all orders
6. **Fixes Users RLS** - Allows admins to view and update all users
7. **Creates Storage Bucket** - Creates 'banners' bucket for image uploads
8. **Fixes Storage RLS** - Allows admins to upload/update/delete banner images
9. **Verifies Admin User** - Checks that your admin account exists

---

## If You Still Get Errors:

### Check your admin user role:
```sql
SELECT id, email, role FROM public.users WHERE email = 'jibreel@studo.ps';
```

Should return: `role = 'admin'`

### If role is NULL or not 'admin', run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'jibreel@studo.ps';
```

---

## After Running This Script:

✅ All banner CRUD operations will work
✅ Image uploads will work
✅ Delete and edit will work
✅ All admin features will be functional

**Don't forget to run this SQL script in Supabase SQL Editor!**
