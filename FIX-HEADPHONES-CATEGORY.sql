-- ============================================
-- STEP 1: CHECK IF HEADPHONES CATEGORY EXISTS
-- ============================================
-- Run this query first to see if the category exists

SELECT id, name, slug 
FROM categories 
WHERE slug ILIKE '%headphone%' 
   OR slug ILIKE '%audio%' 
   OR slug ILIKE '%sound%'
   OR slug ILIKE '%earphone%'
   OR name ILIKE '%headphone%'
   OR name ILIKE '%audio%'
   OR name ILIKE '%sound%'
   OR name ILIKE '%earphone%';

-- ============================================
-- If the query above returns NOTHING, then run OPTION A below
-- If it returns a category, note the slug and use OPTION B
-- ============================================

-- ============================================
-- OPTION A: CREATE HEADPHONES CATEGORY (if it doesn't exist)
-- ============================================
/*
INSERT INTO categories (id, name, slug, description, is_active, display_order, parent_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Headphones',
  'headphones',
  'Headphones and audio accessories',
  true,
  10,  -- Adjust display order as needed
  NULL,  -- NULL means this is a main category
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
*/

-- ============================================
-- AFTER running Option A (if needed), run the subcategories script
-- OR if the category exists but has a different slug,
-- edit ADD-HEADPHONES-SUBCATEGORIES.sql and change:
-- WHERE slug = 'headphones'
-- to use the correct slug from the query above
-- ============================================
