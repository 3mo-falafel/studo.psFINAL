-- EMERGENCY FIX: Make user_id column nullable and drop foreign key constraint
-- This is a more aggressive approach to fix the guest checkout issue
-- Run this in your Supabase SQL Editor

-- Step 1: Check if user_id column allows NULL
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND column_name = 'user_id';

-- Step 2: Make user_id column nullable (if it isn't already)
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Drop ALL foreign key constraints on user_id
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find and drop all foreign key constraints on orders.user_id
    FOR constraint_name IN 
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'orders'
            AND kcu.column_name = 'user_id'
    LOOP
        EXECUTE format('ALTER TABLE orders DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Step 4: Add a new optional foreign key constraint
-- This will maintain referential integrity when user_id is provided, but allow NULL
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL
ON UPDATE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Step 5: Test inserting a guest order
DO $$
DECLARE
    test_order_id uuid;
BEGIN
    -- Test guest order insertion
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
        delivery_method,
        created_at,
        updated_at
    ) VALUES (
        'TEST-GUEST-' || floor(random() * 1000000)::text,
        NULL,  -- Guest order
        'pending',
        100.00,
        20.00,
        0.00,
        120.00,
        'cod',
        'pending',
        '{"full_name":"Test Guest","whatsapp":"+972599999999","address_line1":"Test Address","city":"Test City","state":"Test State","country":"Palestine"}',
        'home',
        NOW(),
        NOW()
    ) RETURNING id INTO test_order_id;
    
    RAISE NOTICE '✅ Test guest order created successfully with ID: %', test_order_id;
    
    -- Clean up test order
    DELETE FROM orders WHERE id = test_order_id;
    RAISE NOTICE '✅ Test order cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Test failed with error: %', SQLERRM;
    RAISE;
END $$;

-- Step 6: Show final column and constraint status
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND column_name = 'user_id';

SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'orders'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '🎉 EMERGENCY FIX APPLIED SUCCESSFULLY! 🎉';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '✅ user_id column is now nullable';
  RAISE NOTICE '✅ Foreign key constraints updated';
  RAISE NOTICE '✅ Guest orders (user_id = NULL) are now allowed';
  RAISE NOTICE '✅ Test guest order creation successful';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 RESTART YOUR APPLICATION NOW:';
  RAISE NOTICE '   1. Stop the development server (Ctrl+C)';
  RAISE NOTICE '   2. Start it again: npm run dev';
  RAISE NOTICE '   3. Test guest checkout in incognito mode';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════════════';
END $$;