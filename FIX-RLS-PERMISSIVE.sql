-- FINAL WORKING FIX: Disable RLS temporarily, then re-enable with correct policies

-- Step 1: Disable RLS temporarily
ALTER TABLE product_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_testimonials DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on product_reviews
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'product_reviews') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON product_reviews', r.policyname);
    END LOOP;
    
    -- Drop all policies on site_testimonials
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'site_testimonials') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON site_testimonials', r.policyname);
    END LOOP;
    
    RAISE NOTICE '✅ All policies dropped';
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create PERMISSIVE policies for product_reviews
CREATE POLICY "allow_all_insert_reviews"
  ON product_reviews
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "allow_all_select_approved_reviews"
  ON product_reviews
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "allow_admin_all_reviews"
  ON product_reviews
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps')
  WITH CHECK ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');

-- Step 5: Create PERMISSIVE policies for site_testimonials
CREATE POLICY "allow_all_insert_testimonials"
  ON site_testimonials
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "allow_all_select_approved_testimonials"
  ON site_testimonials
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "allow_admin_all_testimonials"
  ON site_testimonials
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email')::text = 'admin@studo.ps')
  WITH CHECK ((auth.jwt() ->> 'email')::text = 'admin@studo.ps');

-- Step 6: Verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('product_reviews', 'site_testimonials')
ORDER BY tablename, cmd;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════';
  RAISE NOTICE '✅ RLS POLICIES SUCCESSFULLY CONFIGURED!';
  RAISE NOTICE '════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Everyone can INSERT reviews/testimonials';
  RAISE NOTICE '✅ Everyone can SELECT approved items';
  RAISE NOTICE '✅ Admin can do everything';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 TEST NOW: Submit a review or testimonial!';
  RAISE NOTICE '';
END $$;
