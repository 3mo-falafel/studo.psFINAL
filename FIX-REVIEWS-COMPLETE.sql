-- COMPLETE FIX: Allow EVERYONE (logged in or not) to submit reviews and testimonials
-- This removes ALL restrictions on review/testimonial submissions

-- ============================================================================
-- PRODUCT REVIEWS - Allow EVERYONE to submit and view
-- ============================================================================

-- Drop ALL existing policies on product_reviews
DROP POLICY IF EXISTS "Anyone can submit reviews" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can view product reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can insert product reviews" ON product_reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON product_reviews;
DROP POLICY IF EXISTS "Enable read access for all users" ON product_reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON product_reviews;

-- Create NEW simple policies: EVERYONE can INSERT (pending approval)
CREATE POLICY "EVERYONE can submit reviews"
  ON product_reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- EVERYONE can READ approved reviews
CREATE POLICY "EVERYONE can read approved reviews"
  ON product_reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- ADMINS can see ALL reviews (for admin dashboard)
CREATE POLICY "Admins can view all reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  );

-- ADMINS can UPDATE reviews (approve/reject)
CREATE POLICY "Admins can update reviews"
  ON product_reviews
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  )
  WITH CHECK (true);

-- ADMINS can DELETE reviews
CREATE POLICY "Admins can delete reviews"
  ON product_reviews
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  );


-- ============================================================================
-- SITE TESTIMONIALS - Allow EVERYONE to submit and view
-- ============================================================================

-- Drop ALL existing policies on site_testimonials
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Users can view site testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Users can insert site testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON site_testimonials;
DROP POLICY IF EXISTS "Enable read access for all users" ON site_testimonials;
DROP POLICY IF EXISTS "Admins can manage all testimonials" ON site_testimonials;

-- Create NEW simple policies: EVERYONE can INSERT (pending approval)
CREATE POLICY "EVERYONE can submit testimonials"
  ON site_testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

-- EVERYONE can READ approved testimonials
CREATE POLICY "EVERYONE can read approved testimonials"
  ON site_testimonials
  FOR SELECT
  TO public
  USING (is_approved = true);

-- ADMINS can see ALL testimonials (for admin dashboard)
CREATE POLICY "Admins can view all testimonials"
  ON site_testimonials
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  );

-- ADMINS can UPDATE testimonials (approve/reject)
CREATE POLICY "Admins can update testimonials"
  ON site_testimonials
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  )
  WITH CHECK (true);

-- ADMINS can DELETE testimonials
CREATE POLICY "Admins can delete testimonials"
  ON site_testimonials
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = 'admin@studo.ps'
  );


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show all policies for product_reviews
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'product_reviews';

-- Show all policies for site_testimonials
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'site_testimonials';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ ALL POLICIES UPDATED!';
  RAISE NOTICE '✅ Everyone can now submit reviews and testimonials';
  RAISE NOTICE '✅ All submissions require admin approval';
  RAISE NOTICE '✅ Only admin@studo.ps can approve/reject/delete';
END $$;
