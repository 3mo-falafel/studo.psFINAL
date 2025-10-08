-- NUCLEAR OPTION: Temporarily disable RLS to test if that's the issue
-- WARNING: This removes ALL security - only for testing!

-- Disable RLS on product_reviews (temporarily)
ALTER TABLE product_reviews DISABLE ROW LEVEL SECURITY;

-- Disable RLS on site_testimonials (temporarily)
ALTER TABLE site_testimonials DISABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  WARNING: RLS IS NOW DISABLED!';
  RAISE NOTICE '⚠️  This is for TESTING ONLY!';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Try submitting a review/testimonial now';
  RAISE NOTICE '✅ If it works, we know the problem is the RLS policies';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 After testing, we will re-enable RLS with correct policies';
  RAISE NOTICE '';
END $$;
