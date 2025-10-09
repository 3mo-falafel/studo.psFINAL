-- TEST GUEST USER CREATION MANUALLY
-- This tests if the guest user system is working properly
-- Run this in your Supabase SQL Editor to debug

-- Test 1: Manual guest user creation
INSERT INTO users (
    email, 
    full_name, 
    role, 
    is_guest,
    created_at,
    updated_at
) VALUES (
    'manual_test_guest_' || floor(random() * 1000000)::text || '@studo.ps',
    'Manual Test Guest',
    'customer',
    true,
    NOW(),
    NOW()
) RETURNING id, email, full_name, is_guest;

-- Test 2: Check if guest users can be selected
SELECT id, email, full_name, role, is_guest, created_at
FROM users 
WHERE is_guest = true 
ORDER BY created_at DESC 
LIMIT 5;

-- Test 3: Check RLS policies on users table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Test 4: Check users table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Clean up test user (optional)
-- DELETE FROM users WHERE email LIKE 'manual_test_guest_%@studo.ps' AND is_guest = true;

-- Result summary
DO $$
BEGIN
    RAISE NOTICE '🧪 MANUAL TESTING COMPLETE';
    RAISE NOTICE '✅ Check if guest user was created above';
    RAISE NOTICE '✅ Check if RLS policies are correct';
    RAISE NOTICE '✅ Check if users table has is_guest column';
END $$;