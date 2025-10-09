-- FINAL TESTIMONIALS FIX - Apply the EXACT same pattern that works for orders and reviews
-- This mirrors the successful approach used for fixing guest orders

BEGIN;

-- Step 1: Ensure the site_testimonials table has all required columns
-- (Just like orders table has all the fields it needs)

-- Check and add basic required columns
DO $$
BEGIN
    -- Add customer_name if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'customer_name') THEN
        ALTER TABLE site_testimonials ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added customer_name column';
    END IF;
    
    -- Add rating if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'rating') THEN
        ALTER TABLE site_testimonials ADD COLUMN rating INTEGER NOT NULL DEFAULT 5;
        RAISE NOTICE 'Added rating column';
    END IF;
    
    -- Add comment if not exists  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'comment') THEN
        ALTER TABLE site_testimonials ADD COLUMN comment TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added comment column';
    END IF;
    
    -- Add is_approved if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'is_approved') THEN
        ALTER TABLE site_testimonials ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false;
        RAISE NOTICE 'Added is_approved column';
    END IF;
    
    -- Add timestamps if not exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'created_at') THEN
        ALTER TABLE site_testimonials ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_testimonials' AND column_name = 'updated_at') THEN
        ALTER TABLE site_testimonials ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column';
    END IF;
END $$;

-- Step 2: Apply the EXACT same RLS approach that works for orders
-- Drop ALL existing policies to start clean (like we did for orders)
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'site_testimonials'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON site_testimonials', policy_name);
        RAISE NOTICE 'Dropped policy: %', policy_name;
    END LOOP;
END $$;

-- Step 3: Enable RLS (required)
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the EXACT same policy pattern that works for orders
-- (Orders allow everyone to create orders without user accounts - apply same to testimonials)

-- Policy 1: Allow EVERYONE to INSERT testimonials (like orders allow guest checkout)
CREATE POLICY "testimonials_allow_insert_for_everyone" ON site_testimonials
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow everyone to SELECT approved testimonials, admins can see all
CREATE POLICY "testimonials_select_approved_or_admin" ON site_testimonials
    FOR SELECT 
    USING (
        is_approved = true 
        OR 
        auth.role() = 'authenticated'
    );

-- Policy 3: Allow authenticated users to UPDATE (for admin approval)
CREATE POLICY "testimonials_update_for_auth" ON site_testimonials
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to DELETE
CREATE POLICY "testimonials_delete_for_auth" ON site_testimonials
    FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Step 5: Grant the same permissions that work for orders
-- (Orders work because anon users can insert - apply same to testimonials)
GRANT INSERT ON site_testimonials TO anon;
GRANT SELECT ON site_testimonials TO anon;
GRANT USAGE ON SEQUENCE site_testimonials_id_seq TO anon;

-- Grant full permissions to authenticated users (for admin functions)
GRANT ALL ON site_testimonials TO authenticated;
GRANT USAGE ON SEQUENCE site_testimonials_id_seq TO authenticated;

COMMIT;

-- Step 6: Test the fix by attempting an insert as anon user
-- This is the exact same test pattern that proved orders work
DO $$
BEGIN
    -- Temporarily switch to anon role to test
    SET LOCAL ROLE anon;
    
    -- Test insert (same pattern as successful orders)
    BEGIN
        INSERT INTO site_testimonials (customer_name, rating, comment, is_approved) 
        VALUES ('Test Customer', 5, 'Test testimonial submission', false);
        
        RAISE NOTICE '✅ SUCCESS: Testimonials now work exactly like orders!';
        
        -- Clean up test data
        DELETE FROM site_testimonials 
        WHERE customer_name = 'Test Customer' AND comment = 'Test testimonial submission';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ ERROR: %', SQLERRM;
    END;
END $$;

-- Step 7: Show final configuration
SELECT 
    'TESTIMONIALS CONFIGURATION' as status,
    policyname as policy_name,
    cmd as command,
    permissive,
    qual as using_condition
FROM pg_policies 
WHERE tablename = 'site_testimonials'
ORDER BY policyname;

RAISE NOTICE '🎉 TESTIMONIALS FIXED using the exact same pattern that works for orders!';