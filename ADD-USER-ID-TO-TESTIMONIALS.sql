-- Add user_id column to site_testimonials table (like orders table)
-- This will allow testimonials to work exactly like orders (with guest support)

BEGIN;

-- Add user_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE site_testimonials 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Added user_id column to site_testimonials table';
    ELSE
        RAISE NOTICE 'user_id column already exists in site_testimonials table';
    END IF;
END $$;

-- Make sure all required columns exist and have proper defaults
DO $$
BEGIN
    -- Ensure customer_name column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'customer_name'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
    END IF;
    
    -- Ensure rating column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'rating'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN rating INTEGER NOT NULL DEFAULT 5;
    END IF;
    
    -- Ensure comment column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'comment'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN comment TEXT NOT NULL DEFAULT '';
    END IF;
    
    -- Ensure is_approved column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    -- Ensure created_at column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Ensure updated_at column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_testimonials' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE site_testimonials ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

COMMIT;

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'site_testimonials'
ORDER BY ordinal_position;