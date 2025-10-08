-- =====================================================
-- FIX PRODUCT REVIEWS RLS - Allow Normal Users to Review
-- =====================================================

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can insert reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON product_reviews;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON product_reviews;

-- 2. Create new PERMISSIVE policy for inserting reviews
CREATE POLICY "Allow authenticated users to insert reviews"
ON product_reviews
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Also allow anonymous users to insert reviews (if needed)
CREATE POLICY "Allow anonymous users to insert reviews"
ON product_reviews
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Ensure SELECT policy exists for viewing reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON product_reviews;
CREATE POLICY "Anyone can view approved reviews"
ON product_reviews
FOR SELECT
USING (is_approved = true);

-- 5. Admin policies for managing reviews
DROP POLICY IF EXISTS "Admins can do everything with reviews" ON product_reviews;
CREATE POLICY "Admins can manage all reviews"
ON product_reviews
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 6. Verify RLS is enabled
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- 7. Grant necessary permissions
GRANT INSERT ON product_reviews TO authenticated;
GRANT INSERT ON product_reviews TO anon;
GRANT SELECT ON product_reviews TO authenticated;
GRANT SELECT ON product_reviews TO anon;

-- TEST: Try inserting a review
-- This should work now for any authenticated user
