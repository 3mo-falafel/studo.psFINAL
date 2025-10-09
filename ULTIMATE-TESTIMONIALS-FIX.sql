-- ULTIMATE TESTIMONIALS FIX
-- This will completely reset and fix the RLS policies for site_testimonials

BEGIN;

-- Step 1: Drop ALL existing policies to start fresh
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Get all policies for site_testimonials table
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'site_testimonials'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON site_testimonials', policy_name);
        RAISE NOTICE 'Dropped policy: %', policy_name;
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SUPER PERMISSIVE policies

-- Policy 1: Allow ANYONE to INSERT testimonials (no restrictions at all)
CREATE POLICY "testimonials_super_public_insert" ON site_testimonials
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow ANYONE to READ approved testimonials
CREATE POLICY "testimonials_public_select" ON site_testimonials
    FOR SELECT 
    USING (is_approved = true OR auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users to UPDATE (for admin approval)
CREATE POLICY "testimonials_auth_update" ON site_testimonials
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (true);

-- Policy 4: Allow authenticated users to DELETE
CREATE POLICY "testimonials_auth_delete" ON site_testimonials
    FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Step 4: Grant necessary permissions to public (anon) role
GRANT INSERT ON site_testimonials TO anon;
GRANT SELECT ON site_testimonials TO anon;
GRANT USAGE ON SEQUENCE site_testimonials_id_seq TO anon;

-- Grant permissions to authenticated users
GRANT ALL ON site_testimonials TO authenticated;
GRANT USAGE ON SEQUENCE site_testimonials_id_seq TO authenticated;

-- Step 5: Verify the table structure and add any missing columns
DO $$
BEGIN
    -- Ensure all required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'customer_name') THEN
        ALTER TABLE site_testimonials ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'rating') THEN
        ALTER TABLE site_testimonials ADD COLUMN rating INTEGER NOT NULL DEFAULT 5;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'comment') THEN
        ALTER TABLE site_testimonials ADD COLUMN comment TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'is_approved') THEN
        ALTER TABLE site_testimonials ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'created_at') THEN
        ALTER TABLE site_testimonials ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

COMMIT;

-- Step 6: Test with a direct insert to verify it works
DO $$
BEGIN
    -- Test insert as anon user
    SET ROLE anon;
    
    BEGIN
        INSERT INTO site_testimonials (customer_name, rating, comment, is_approved) 
        VALUES ('Test User', 5, 'Test testimonial', false);
        
        RAISE NOTICE 'SUCCESS: Test insert worked!';
        
        -- Clean up test data
        DELETE FROM site_testimonials WHERE customer_name = 'Test User' AND comment = 'Test testimonial';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Test insert failed: %', SQLERRM;
    END;
    
    -- Reset role
    RESET ROLE;
END $$;

-- Step 7: Display final policy status
SELECT 
    policyname as policy_name,
    cmd as command,
    permissive,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'site_testimonials'
ORDER BY policyname;

RAISE NOTICE 'ULTIMATE TESTIMONIALS FIX COMPLETED!';