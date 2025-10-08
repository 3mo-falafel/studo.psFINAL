-- ============================================
-- FIX: Admin Reviews Access - RLS Policies
-- ============================================
-- This script fixes the issue where admins cannot see reviews in the dashboard
-- The problem: "Anyone can read approved reviews" policy only allows seeing approved reviews
-- Admins need to see ALL reviews (approved + pending) to manage them

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;

-- Create a new SELECT policy that allows:
-- 1. Everyone can see APPROVED reviews (for product pages)
-- 2. ADMINS can see ALL reviews (for admin dashboard)
CREATE POLICY "Public can read approved, admins can read all"
  ON product_reviews FOR SELECT
  USING (
    is_approved = true 
    OR 
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Keep the insert policy (anyone can submit)
DROP POLICY IF EXISTS "Anyone can insert reviews" ON product_reviews;
CREATE POLICY "Anyone can insert reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

-- Keep the admin management policy (admins can UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can manage reviews" ON product_reviews;
CREATE POLICY "Admins can update and delete reviews"
  ON product_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete reviews"
  ON product_reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Same fix for site_testimonials
-- ============================================

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;

-- Create a new SELECT policy that allows:
-- 1. Everyone can see APPROVED testimonials (for footer)
-- 2. ADMINS can see ALL testimonials (for admin dashboard)
CREATE POLICY "Public can read approved testimonials, admins can read all"
  ON site_testimonials FOR SELECT
  USING (
    is_approved = true 
    OR 
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Keep other policies
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON site_testimonials;
CREATE POLICY "Anyone can submit testimonials"
  ON site_testimonials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update testimonials"
  ON site_testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON site_testimonials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Verify: Check if reviews exist
-- ============================================
-- Run this separately to see if reviews exist in the database:
-- SELECT COUNT(*) as total_reviews, 
--        SUM(CASE WHEN is_approved THEN 1 ELSE 0 END) as approved,
--        SUM(CASE WHEN NOT is_approved THEN 1 ELSE 0 END) as pending
-- FROM product_reviews;
