-- Fix testimonials to work like reviews (allow admin updates)
-- This applies the same pattern that made reviews work

-- Drop existing restrictive policies for site_testimonials
DROP POLICY IF EXISTS "site_testimonials_select_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_insert_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_update_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_delete_policy" ON public.site_testimonials;

-- Create simple, permissive policies like reviews
CREATE POLICY "Anyone can read approved testimonials" ON public.site_testimonials
    FOR SELECT USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert testimonials" ON public.site_testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials" ON public.site_testimonials
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete testimonials" ON public.site_testimonials
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;

-- Test if the policies work by checking what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('product_reviews', 'site_testimonials')
ORDER BY tablename, policyname;