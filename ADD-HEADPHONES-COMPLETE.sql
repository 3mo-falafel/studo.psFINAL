-- ============================================
-- COMPLETE HEADPHONES SETUP
-- ============================================
-- This script will:
-- 1. Create the Headphones category if it doesn't exist
-- 2. Create all 4 subcategories
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Create Headphones category if it doesn't exist
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order, parent_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Headphones',
  'headphones',
  'Premium headphones and audio accessories',
  'https://media.ldlc.com/r1600/ld/products/00/06/16/68/LD0006166841.jpg',
  true,
  10,  -- Adjust display order as needed
  NULL,  -- NULL means this is a main category
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Step 2: Create subcategories
DO $$
DECLARE
  headphones_category_id UUID;
  wireless_headphones_id UUID;
  wireless_airpods_id UUID;
  gaming_headphones_id UUID;
  wired_headphones_id UUID;
BEGIN
  -- Get Headphones category ID
  SELECT id INTO headphones_category_id
  FROM categories
  WHERE slug = 'headphones'
  LIMIT 1;

  IF headphones_category_id IS NULL THEN
    RAISE EXCEPTION 'Headphones category not found! Something went wrong with Step 1.';
  END IF;

  -- Generate UUIDs for subcategories
  wireless_headphones_id := gen_random_uuid();
  wireless_airpods_id := gen_random_uuid();
  gaming_headphones_id := gen_random_uuid();
  wired_headphones_id := gen_random_uuid();

  -- Insert subcategories
  INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, display_order, created_at, updated_at)
  VALUES
    -- 1. Wireless Headphones
    (
      wireless_headphones_id,
      'Wireless Headphones',
      'wireless-headphones',
      'Premium wireless over-ear headphones',
      'https://media.ldlc.com/r1600/ld/products/00/06/16/68/LD0006166841.jpg',
      headphones_category_id,
      true,
      1,
      NOW(),
      NOW()
    ),
    -- 2. Wireless Airpods
    (
      wireless_airpods_id,
      'Wireless Airpods',
      'wireless-airpods',
      'True wireless earbuds and airpods',
      'https://uk.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw018a07e6/01.JBL_Tune%20Buds_Product%20Image_Hero_Purple.png?sw=680&sh=680',
      headphones_category_id,
      true,
      2,
      NOW(),
      NOW()
    ),
    -- 3. Gaming Headphones
    (
      gaming_headphones_id,
      'Gaming Headphones',
      'gaming-headphones',
      'High-performance gaming headsets',
      'https://cdns3.thecosmicbyte.com/wp-content/uploads/G2050-BLUE.jpg',
      headphones_category_id,
      true,
      3,
      NOW(),
      NOW()
    ),
    -- 4. Wired Headphones
    (
      wired_headphones_id,
      'Wired Headphones',
      'wired-headphones',
      'Reliable wired headphones',
      'https://i5.walmartimages.com/seo/Sony-MDR-ZX110-Wired-On-Ear-Headphones-Black_7c3f7ed8-05e7-49d4-98fe-616a1997debf.58b3271a16b69c93a3cd8d6600b7d3cc.jpeg',
      headphones_category_id,
      true,
      4,
      NOW(),
      NOW()
    )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    parent_id = EXCLUDED.parent_id,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

  RAISE NOTICE 'Headphones category and subcategories added successfully!';
  RAISE NOTICE 'Parent Category ID: %', headphones_category_id;
  RAISE NOTICE 'Wireless Headphones ID: %', wireless_headphones_id;
  RAISE NOTICE 'Wireless Airpods ID: %', wireless_airpods_id;
  RAISE NOTICE 'Gaming Headphones ID: %', gaming_headphones_id;
  RAISE NOTICE 'Wired Headphones ID: %', wired_headphones_id;
END $$;

-- Step 3: Verify everything was created
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(s.name, 'N/A') as subcategory_name,
  COALESCE(s.slug, 'N/A') as subcategory_slug,
  s.display_order,
  s.is_active
FROM categories c
LEFT JOIN categories s ON s.parent_id = c.id
WHERE c.slug = 'headphones'
ORDER BY s.display_order NULLS FIRST;

-- ============================================
-- SUCCESS! You should now see:
-- 1. Headphones main category
-- 2. 4 subcategories (Wireless, Airpods, Gaming, Wired)
-- ============================================

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Visit: http://localhost:3000/categories/headphones
-- 2. You should see the subcategory filter!
-- 3. Assign products to subcategories (optional):
--    UPDATE products 
--    SET subcategory_id = (SELECT id FROM categories WHERE slug = 'wireless-headphones')
--    WHERE name ILIKE '%wireless%' AND name ILIKE '%headphone%';
-- ============================================
