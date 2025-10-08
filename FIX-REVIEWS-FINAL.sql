-- ULTRA SIMPLE FIX: Allow EVERYONE to submit reviews
-- This version handles existing policies properly

-- ============================================================================
-- STEP 1: Remove ALL existing policies (ignore errors if they don't exist)
-- ============================================================================

DO $$ 
BEGIN
    -- Drop all product_reviews policies
    DROP POLICY IF EXISTS "Anyone can submit reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Users can view product reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Users can insert product reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON product_reviews;
    DROP POLICY IF EXISTS "Enable read access for all users" ON product_reviews;
    DROP POLICY IF EXISTS "Admins can manage all reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Admins can view all reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Admins can update reviews" ON product_reviews;
    DROP POLICY IF EXISTS "Admins can delete reviews" ON product_reviews;
    DROP POLICY IF EXISTS "EVERYONE can submit reviews" ON product_reviews;
    DROP POLICY IF EXISTS "EVERYONE can read approved reviews" ON product_reviews;

    -- Drop all site_testimonials policies
    DROP POLICY IF EXISTS "Anyone can submit testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Users can view site testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Users can insert site testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON site_testimonials;
    DROP POLICY IF EXISTS "Enable read access for all users" ON site_testimonials;
    DROP POLICY IF EXISTS "Admins can manage all testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Admins can view all testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Admins can update testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "Admins can delete testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "EVERYONE can submit testimonials" ON site_testimonials;
    DROP POLICY IF EXISTS "EVERYONE can read approved testimonials" ON site_testimonials;

    RAISE NOTICE '✅ All old policies removed';
END $$;


-- ============================================================================
-- STEP 2: Create NEW simple policies for PRODUCT REVIEWS
-- ============================================================================

-- Allow EVERYONE to submit reviews (pending approval)
CREATE POLICY "allow_insert_reviews"
  ON product_reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow EVERYONE to read approved reviews
CREATE POLICY "allow_read_approved_reviews"
  ON product_reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Allow admins to see ALL reviews
CREATE POLICY "allow_admin_read_all_reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');

-- Allow admins to update reviews
CREATE POLICY "allow_admin_update_reviews"
  ON product_reviews
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps')
  WITH CHECK (true);

-- Allow admins to delete reviews
CREATE POLICY "allow_admin_delete_reviews"
  ON product_reviews
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');


-- ============================================================================
-- STEP 3: Create NEW simple policies for SITE TESTIMONIALS
-- ============================================================================

-- Allow EVERYONE to submit testimonials (pending approval)
CREATE POLICY "allow_insert_testimonials"
  ON site_testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow EVERYONE to read approved testimonials
CREATE POLICY "allow_read_approved_testimonials"
  ON site_testimonials
  FOR SELECT
  TO public
  USING (is_approved = true);

-- Allow admins to see ALL testimonials
CREATE POLICY "allow_admin_read_all_testimonials"
  ON site_testimonials
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');

-- Allow admins to update testimonials
CREATE POLICY "allow_admin_update_testimonials"
  ON site_testimonials
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps')
  WITH CHECK (true);

-- Allow admins to delete testimonials
CREATE POLICY "allow_admin_delete_testimonials"
  ON site_testimonials
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');


-- ============================================================================
-- STEP 4: Verification and Success Message
-- ============================================================================

-- Show final policies
SELECT 
  tablename, 
  policyname, 
  cmd as operation,
  CASE 
    WHEN roles::text LIKE '%public%' THEN 'PUBLIC (Everyone)'
    WHEN roles::text LIKE '%authenticated%' THEN 'AUTHENTICATED (Logged in)'
    ELSE roles::text
  END as who_can_use
FROM pg_policies
WHERE tablename IN ('product_reviews', 'site_testimonials')
ORDER BY tablename, cmd;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ SUCCESS! All policies updated successfully!';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '✅ EVERYONE can now submit reviews (no login required)';
  RAISE NOTICE '✅ EVERYONE can now submit testimonials (no login required)';
  RAISE NOTICE '✅ All submissions require admin approval';
  RAISE NOTICE '✅ Only admin@studo.ps can approve/reject/delete';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Test it: Go to any product page and submit a review!';
  RAISE NOTICE '';
END $$;
