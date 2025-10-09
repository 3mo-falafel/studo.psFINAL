-- Create Admin User: Jibreel
-- Email: jibreelebornat@gmail.com
-- Password: Jibreelra123

-- ========================================
-- DIAGNOSTIC STEP: Check if user exists
-- ========================================

-- Check in auth.users (Supabase Auth table)
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'jibreelebornat@gmail.com';

-- Check in public.users (Your users table)
SELECT id, email, full_name, role, created_at
FROM public.users
WHERE email = 'jibreelebornat@gmail.com';

-- ========================================
-- FIX STEP 1: Ensure role column exists
-- ========================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- ========================================
-- FIX STEP 2: Create user entry if missing
-- ========================================
-- If the user signed up but doesn't exist in public.users, insert them
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  'Jibreel',
  'admin',
  au.created_at,
  NOW()
FROM auth.users au
WHERE au.email = 'jibreelebornat@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'jibreelebornat@gmail.com'
);

-- ========================================
-- FIX STEP 3: Update to admin role
-- ========================================
UPDATE public.users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'jibreelebornat@gmail.com';

-- ========================================
-- VERIFICATION: Check admin status
-- ========================================
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  CASE 
    WHEN u.role = 'admin' THEN '✅ ADMIN ACCESS GRANTED'
    ELSE '❌ NOT ADMIN - ROLE IS: ' || COALESCE(u.role, 'NULL')
  END as status,
  u.created_at,
  u.updated_at
FROM public.users u
WHERE u.email = 'jibreelebornat@gmail.com';
