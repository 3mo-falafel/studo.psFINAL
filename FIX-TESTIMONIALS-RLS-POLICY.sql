-- FIX: Allow users to submit site testimonials
-- This resolves "new row violates rls policy for table site_testimonials" error

-- First, let's see what policies currently exist
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    with_check,
    qual
FROM pg_policies 
WHERE tablename = 'site_testimonials'
ORDER BY policyname;

-- Drop ALL existing policies on site_testimonials (comprehensive cleanup)
DROP POLICY IF EXISTS "site_testimonials_select_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_insert_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_update_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "site_testimonials_delete_policy" ON public.site_testimonials;
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "Allow public testimonial submissions" ON public.site_testimonials;
DROP POLICY IF EXISTS "Allow reading approved testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.site_testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.site_testimonials;

-- Create fresh, simple policies (using unique names to avoid conflicts)
CREATE POLICY "public_can_insert_testimonials" ON public.site_testimonials
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "public_can_read_approved_testimonials" ON public.site_testimonials
    FOR SELECT 
    USING (is_approved = true OR auth.uid() IS NOT NULL);

CREATE POLICY "auth_users_can_update_testimonials" ON public.site_testimonials
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_users_can_delete_testimonials" ON public.site_testimonials
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;

-- Verify the fix worked
SELECT 
    'AFTER FIX:' as status,
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    with_check,
    qual
FROM pg_policies 
WHERE tablename = 'site_testimonials'
ORDER BY policyname;