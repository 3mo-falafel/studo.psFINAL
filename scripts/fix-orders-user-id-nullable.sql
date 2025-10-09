-- Make user_id nullable in orders table to allow guest checkout
-- Run this in Supabase SQL Editor

-- 1. Fix orders table
-- First, drop the foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Make user_id nullable
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- 2. Fix discount_codes table (if needed)
ALTER TABLE discount_codes DROP CONSTRAINT IF EXISTS discount_codes_user_id_fkey;

-- Make user_id nullable in discount_codes
ALTER TABLE discount_codes ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE discount_codes 
ADD CONSTRAINT discount_codes_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- Verify the changes
SELECT 
    'orders' as table_name,
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'user_id'
UNION ALL
SELECT 
    'discount_codes' as table_name,
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'discount_codes' 
AND column_name = 'user_id';
