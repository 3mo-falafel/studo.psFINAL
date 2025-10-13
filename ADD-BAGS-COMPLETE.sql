-- ============================================
-- COMPLETE BAGS SETUP
-- ============================================
-- This script will:
-- 1. Create the Bags category if it doesn't exist
-- 2. Create all 3 subcategories
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Create Bags category if it doesn't exist
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order, parent_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Bags',
  'bags',
  'Stylish bags and carrying solutions',
  'https://boconi.com/cdn/shop/products/cognac_front.jpg?v=1710510583',
  true,
  9,  -- Adjust display order as needed
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
  bags_category_id UUID;
  backpacks_id UUID;
  laptop_bags_id UUID;
  handbags_id UUID;
BEGIN
  -- Get Bags category ID
  SELECT id INTO bags_category_id
  FROM categories
  WHERE slug = 'bags'
  LIMIT 1;

  IF bags_category_id IS NULL THEN
    RAISE EXCEPTION 'Bags category not found! Something went wrong with Step 1.';
  END IF;

  -- Generate UUIDs for subcategories
  backpacks_id := gen_random_uuid();
  laptop_bags_id := gen_random_uuid();
  handbags_id := gen_random_uuid();

  -- Insert subcategories
  INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, display_order, created_at, updated_at)
  VALUES
    -- 1. Backpacks
    (
      backpacks_id,
      'Backpacks',
      'backpacks',
      'Stylish and functional backpacks',
      'https://boconi.com/cdn/shop/products/cognac_front.jpg?v=1710510583',
      bags_category_id,
      true,
      1,
      NOW(),
      NOW()
    ),
    -- 2. Laptop Bags
    (
      laptop_bags_id,
      'Laptop Bags',
      'laptop-bags',
      'Professional laptop bags and cases',
      'https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-3d-render-laptop-bag-perspective-view-png-image_9192010.png',
      bags_category_id,
      true,
      2,
      NOW(),
      NOW()
    ),
    -- 3. Handbags
    (
      handbags_id,
      'Handbags',
      'handbags',
      'Designer handbags and accessories',
      'https://calvinklein-eu.scene7.com/is/image/CalvinKleinEU/K50K511190_BAX_main?$b2c_uplp_listing_2560$',
      bags_category_id,
      true,
      3,
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

  RAISE NOTICE 'Bags category and subcategories added successfully!';
  RAISE NOTICE 'Parent Category ID: %', bags_category_id;
  RAISE NOTICE 'Backpacks ID: %', backpacks_id;
  RAISE NOTICE 'Laptop Bags ID: %', laptop_bags_id;
  RAISE NOTICE 'Handbags ID: %', handbags_id;
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
WHERE c.slug = 'bags'
ORDER BY s.display_order NULLS FIRST;

-- ============================================
-- SUCCESS! You should now see:
-- 1. Bags main category
-- 2. 3 subcategories (Backpacks, Laptop Bags, Handbags)
-- ============================================

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Visit: http://localhost:3000/categories/bags
-- 2. You should see the subcategory filter!
-- 3. Assign products to subcategories (optional):
--    UPDATE products 
--    SET subcategory_id = (SELECT id FROM categories WHERE slug = 'backpacks')
--    WHERE name ILIKE '%backpack%';
-- ============================================
