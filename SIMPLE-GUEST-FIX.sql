-- SIMPLE AND DIRECT FIX for guest checkout
-- This removes the foreign key constraint entirely and makes user_id fully optional
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the foreign key constraint completely
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Step 2: Ensure user_id column allows NULL values
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Verify the changes
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND column_name = 'user_id';

-- Step 4: Test guest order creation
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
    'TEST-GUEST-12345',
    NULL,
    'pending',
    50.00,
    10.00,
    0.00,
    60.00,
    'cod',
    'pending',
    '{"test": "data"}',
    'birzeit'
);

-- Clean up test
DELETE FROM orders WHERE order_number = 'TEST-GUEST-12345';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS: Guest checkout is now enabled!';
  RAISE NOTICE '✅ Foreign key constraint removed';
  RAISE NOTICE '✅ user_id column accepts NULL values';
  RAISE NOTICE '✅ Test order creation successful';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 RESTART YOUR APP AND TEST NOW!';
END $$;