-- CREATE TEST REVIEWS FOR ADMIN TO MANAGE
-- This will create some sample reviews so you can test the approve/reject functionality
-- Run this in your Supabase SQL Editor

-- Step 1: Check if we have any products to review
SELECT id, name, slug FROM products LIMIT 5;

-- Step 2: Insert some test reviews (you can approve/reject these)
INSERT INTO product_reviews (product_id, customer_name, rating, comment, is_approved, created_at) 
VALUES 
  (
    (SELECT id FROM products LIMIT 1),
    'Test Customer 1',
    5,
    'This is an excellent product! I highly recommend it to everyone.',
    false,
    NOW() - INTERVAL '2 hours'
  ),
  (
    (SELECT id FROM products LIMIT 1),
    'Test Customer 2', 
    4,
    'Good quality product, fast delivery. Very satisfied with my purchase.',
    false,
    NOW() - INTERVAL '1 hour'
  ),
  (
    (SELECT id FROM products OFFSET 1 LIMIT 1),
    'Test Customer 3',
    3,
    'Average product, nothing special but does the job.',
    false,
    NOW() - INTERVAL '30 minutes'
  ),
  (
    (SELECT id FROM products OFFSET 2 LIMIT 1),
    'Happy Customer',
    5,
    'Amazing quality! Will definitely buy again. Great customer service too.',
    true,  -- This one is already approved
    NOW() - INTERVAL '1 day'
  );

-- Step 3: Verify the reviews were created
SELECT 
  pr.id,
  pr.customer_name,
  pr.rating,
  pr.comment,
  pr.is_approved,
  pr.created_at,
  p.name as product_name
FROM product_reviews pr
LEFT JOIN products p ON pr.product_id = p.id
ORDER BY pr.created_at DESC;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 TEST REVIEWS CREATED! 🎉';
  RAISE NOTICE '';
  RAISE NOTICE '✅ 4 test reviews added to product_reviews table';
  RAISE NOTICE '✅ 3 pending reviews (for you to approve/reject)';
  RAISE NOTICE '✅ 1 approved review (to test the approved tab)';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 NOW YOU CAN TEST:';
  RAISE NOTICE '   1. Go to /admin/reviews';
  RAISE NOTICE '   2. You should see reviews in both tabs';
  RAISE NOTICE '   3. Click Approve/Reject buttons';
  RAISE NOTICE '   4. They should work properly now!';
  RAISE NOTICE '';
END $$;