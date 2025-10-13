-- ============================================
-- ADD COMPUTER ACCESSORIES SUBCATEGORIES
-- ============================================
-- This script adds 5 subcategories for Computer Accessories category
-- Run this in your Supabase SQL Editor

-- Step 1: Get the Computer Accessories category ID
DO $$
DECLARE
  computer_category_id UUID;
  mice_id UUID;
  keyboards_id UUID;
  speakers_id UUID;
  mouse_pads_id UUID;
  stands_id UUID;
BEGIN
  -- Get Computer Accessories category ID
  SELECT id INTO computer_category_id
  FROM categories
  WHERE slug = 'computer-accessories'
  LIMIT 1;

  IF computer_category_id IS NULL THEN
    RAISE EXCEPTION 'Computer Accessories category not found! Create it first.';
  END IF;

  -- Generate UUIDs for subcategories
  mice_id := gen_random_uuid();
  keyboards_id := gen_random_uuid();
  speakers_id := gen_random_uuid();
  mouse_pads_id := gen_random_uuid();
  stands_id := gen_random_uuid();

  -- Insert subcategories
  INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, display_order, created_at, updated_at)
  VALUES
    -- 1. Mice
    (
      mice_id,
      'Mice',
      'mice',
      'Computer mice for all your needs',
      'https://www.jbhifi.com.au/cdn/shop/files/598680-Product-0-I-637974588225483899_ea090473-b612-4294-b465-065a1e88c2d7.jpg?v=1721103800',
      computer_category_id,
      true,
      1,
      NOW(),
      NOW()
    ),
    -- 2. Keyboards
    (
      keyboards_id,
      'Keyboards',
      'keyboards',
      'Mechanical and membrane keyboards',
      'https://gadgettime.co.za/cdn/shop/files/HAVIT_KB903L_Wired_RGB_Mechanical_Keyboard_-_Black.jpg?v=1753192029',
      computer_category_id,
      true,
      2,
      NOW(),
      NOW()
    ),
    -- 3. Speakers
    (
      speakers_id,
      'Speakers',
      'speakers',
      'High-quality computer speakers',
      'https://m.media-amazon.com/images/I/81b1vgAABmL._UF894,1000_QL80_.jpg',
      computer_category_id,
      true,
      3,
      NOW(),
      NOW()
    ),
    -- 4. Mouse Pads
    (
      mouse_pads_id,
      'Mouse Pads',
      'mouse-pads',
      'Gaming and professional mouse pads',
      'https://images-na.ssl-images-amazon.com/images/I/81gmOX9oDQL._UL500_.jpg',
      computer_category_id,
      true,
      4,
      NOW(),
      NOW()
    ),
    -- 5. Stands
    (
      stands_id,
      'Stands',
      'computer-stands',
      'Laptop and monitor stands',
      'https://www.poppin.com/cdn/shop/products/poppin_silver_laptop_riser_05_732x700.jpg?v=1756211192',
      computer_category_id,
      true,
      5,
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

  RAISE NOTICE 'Computer Accessories subcategories added successfully!';
  RAISE NOTICE 'Parent Category ID: %', computer_category_id;
  RAISE NOTICE 'Mice ID: %', mice_id;
  RAISE NOTICE 'Keyboards ID: %', keyboards_id;
  RAISE NOTICE 'Speakers ID: %', speakers_id;
  RAISE NOTICE 'Mouse Pads ID: %', mouse_pads_id;
  RAISE NOTICE 'Stands ID: %', stands_id;
END $$;

-- Step 2: Verify the subcategories
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  s.name as subcategory_name,
  s.slug as subcategory_slug,
  s.display_order,
  s.is_active
FROM categories c
LEFT JOIN categories s ON s.parent_id = c.id
WHERE c.slug = 'computer-accessories'
ORDER BY s.display_order;

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Assign products to subcategories by updating their subcategory_id
-- 2. Example query to assign products:
--    UPDATE products 
--    SET subcategory_id = (SELECT id FROM categories WHERE slug = 'mice')
--    WHERE id = 'your-product-id';
-- ============================================
