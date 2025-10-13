-- ============================================
-- ADD BAGS SUBCATEGORIES
-- ============================================
-- 1. Create Bags category if it doesn't exist
-- 2. Create all 3 subcategories
-- Run this script in your Supabase SQL Editor

-- Step 1: Create Bags category if it doesn't exist
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order, parent_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Bags',
  'bags',
  'Backpacks, laptop bags, and more',
  'https://boconi.com/cdn/shop/products/cognac_front.jpg?v=1710510583',
  true,
  12,
  NULL,
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
  calvin_bag_id UUID;
BEGIN
  SELECT id INTO bags_category_id FROM categories WHERE slug = 'bags' LIMIT 1;
  IF bags_category_id IS NULL THEN
    RAISE EXCEPTION 'Bags category not found!';
  END IF;
  backpacks_id := gen_random_uuid();
  laptop_bags_id := gen_random_uuid();
  calvin_bag_id := gen_random_uuid();
  INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, display_order, created_at, updated_at)
  VALUES
    (backpacks_id, 'Backpacks', 'backpacks', 'Backpacks', 'https://boconi.com/cdn/shop/products/cognac_front.jpg?v=1710510583', bags_category_id, true, 1, NOW(), NOW()),
    (laptop_bags_id, 'Laptop Bags', 'laptop-bags', 'Laptop bags', 'https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-3d-render-laptop-bag-perspective-view-png-image_9192010.png', bags_category_id, true, 2, NOW(), NOW()),
    (calvin_bag_id, 'Calvin Klein Bag', 'calvin-klein-bag', 'Calvin Klein designer bag', 'https://calvinklein-eu.scene7.com/is/image/CalvinKleinEU/K50K511190_BAX_main?$b2c_uplp_listing_2560$', bags_category_id, true, 3, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    parent_id = EXCLUDED.parent_id,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();
END $$;

-- Step 3: Verify
SELECT c.name as category_name, c.slug as category_slug, COALESCE(s.name, 'N/A') as subcategory_name, COALESCE(s.slug, 'N/A') as subcategory_slug, s.display_order, s.is_active
FROM categories c
LEFT JOIN categories s ON s.parent_id = c.id
WHERE c.slug = 'bags'
ORDER BY s.display_order NULLS FIRST;
