-- ============================================
-- ADD HEADPHONES SUBCATEGORIES
-- ============================================
-- 1. Create Headphones category if it doesn't exist
-- 2. Create all 4 subcategories
-- Run this script in your Supabase SQL Editor

-- Step 1: Create Headphones category if it doesn't exist
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order, parent_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Headphones',
  'headphones',
  'All types of headphones and airpods',
  'https://media.ldlc.com/r1600/ld/products/00/06/16/68/LD0006166841.jpg',
  true,
  13,
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
  headphones_category_id UUID;
  wireless_headphones_id UUID;
  wireless_airpods_id UUID;
  gaming_headphones_id UUID;
  wired_headphones_id UUID;
BEGIN
  SELECT id INTO headphones_category_id FROM categories WHERE slug = 'headphones' LIMIT 1;
  IF headphones_category_id IS NULL THEN
    RAISE EXCEPTION 'Headphones category not found!';
  END IF;
  wireless_headphones_id := gen_random_uuid();
  wireless_airpods_id := gen_random_uuid();
  gaming_headphones_id := gen_random_uuid();
  wired_headphones_id := gen_random_uuid();
  INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, display_order, created_at, updated_at)
  VALUES
    (wireless_headphones_id, 'Wireless Headphones', 'wireless-headphones', 'Wireless headphones', 'https://media.ldlc.com/r1600/ld/products/00/06/16/68/LD0006166841.jpg', headphones_category_id, true, 1, NOW(), NOW()),
    (wireless_airpods_id, 'Wireless Airpods', 'wireless-airpods', 'Wireless airpods', 'https://uk.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw018a07e6/01.JBL_Tune%20Buds_Product%20Image_Hero_Purple.png?sw=680&sh=680', headphones_category_id, true, 2, NOW(), NOW()),
    (gaming_headphones_id, 'Gaming Headphones', 'gaming-headphones', 'Gaming headphones', 'https://cdns3.thecosmicbyte.com/wp-content/uploads/G2050-BLUE.jpg', headphones_category_id, true, 3, NOW(), NOW()),
    (wired_headphones_id, 'Wired Headphones', 'wired-headphones', 'Wired headphones', 'https://i5.walmartimages.com/seo/Sony-MDR-ZX110-Wired-On-Ear-Headphones-Black_7c3f7ed8-05e7-49d4-98fe-616a1997debf.58b3271a16b69c93a3cd8d6600b7d3cc.jpeg', headphones_category_id, true, 4, NOW(), NOW())
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
WHERE c.slug = 'headphones'
ORDER BY s.display_order NULLS FIRST;
