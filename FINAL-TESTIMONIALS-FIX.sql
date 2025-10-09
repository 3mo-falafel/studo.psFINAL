-- CLEAN UP: Remove duplicate policies and keep only the essential ones
-- This will ensure testimonial submissions work without conflicts

-- Drop ALL policies to start fresh
DROP POLICY IF EXISTS "allow_admin_all_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "allow_all_insert_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "allow_all_select_approved_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "auth_users_can_delete_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "auth_users_can_update_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "public_can_insert_testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "public_can_read_approved_testimonials" ON public.site_testimonials;

-- Create ONLY the essential policies (following the working reviews pattern)
CREATE POLICY "testimonials_public_insert" ON public.site_testimonials
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "testimonials_public_select" ON public.site_testimonials
    FOR SELECT 
    USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "testimonials_admin_update" ON public.site_testimonials
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "testimonials_admin_delete" ON public.site_testimonials
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;

-- Final verification
SELECT 
    'FINAL RESULT:' as status,
    policyname, 
    cmd,
    with_check,
    qual
FROM pg_policies 
WHERE tablename = 'site_testimonials'
ORDER BY cmd, policyname;