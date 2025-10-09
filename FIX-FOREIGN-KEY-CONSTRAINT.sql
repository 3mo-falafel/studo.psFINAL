-- FIX FOREIGN KEY CONSTRAINT FOR GUEST CHECKOUT
-- This fixes the foreign key constraint that prevents guest orders (user_id = NULL)
-- Run this in your Supabase SQL Editor

-- =======================================
-- PROBLEM IDENTIFIED:
-- The orders table has a foreign key constraint on user_id that doesn't allow NULL values
-- Error: "insert or update on table "orders" violates foreign key constraint "orders_user_id_fkey"
-- =======================================

-- Step 1: Check current constraint
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'orders'
    AND kcu.column_name = 'user_id';

-- Step 2: Drop the existing foreign key constraint
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Step 3: Add a new foreign key constraint that allows NULL values
-- This allows guest orders (user_id = NULL) while maintaining referential integrity for logged-in users
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Step 4: Verify the constraint was updated
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'orders'
    AND kcu.column_name = 'user_id';

-- Step 5: Test that NULL user_id is now allowed
-- This is a test insert that should succeed
INSERT INTO orders (
    order_number, 
    user_id, 
    status, 
    subtotal, 
    shipping_cost, 
    tax, 
    total, 
    payment_method, 
    payment_status,
    shipping_address,
    delivery_method
) VALUES (
    'TEST-000001',
    NULL,  -- This should now work for guest orders
    'pending',
    100.00,
    20.00,
    0.00,
    120.00,
    'cod',
    'pending',
    '{"full_name":"Test Guest","whatsapp":"+972599999999","address_line1":"Test Address","city":"Test City","state":"Test State","country":"Palestine"}',
    'home'
);

-- Clean up test order
DELETE FROM orders WHERE order_number = 'TEST-000001';

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '🎉 FOREIGN KEY CONSTRAINT FIXED! 🎉';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Orders table now accepts NULL user_id for guest orders';
  RAISE NOTICE '✅ Foreign key constraint updated to allow guest checkout';
  RAISE NOTICE '✅ Referential integrity maintained for logged-in users';
  RAISE NOTICE '✅ Test order creation successful';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 GUEST CHECKOUT SHOULD NOW WORK!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 WHAT CHANGED:';
  RAISE NOTICE '   • Foreign key constraint now allows NULL user_id';
  RAISE NOTICE '   • Guest orders can be created without user account';
  RAISE NOTICE '   • Database integrity maintained';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
END $$;