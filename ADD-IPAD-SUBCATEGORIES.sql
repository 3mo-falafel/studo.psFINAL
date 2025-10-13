-- Add subcategory_id column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);

-- Get the iPad Accessories category ID
DO $$
DECLARE
  ipad_category_id UUID;
  pencils_id UUID;
  keyboards_mice_id UUID;
  stands_id UUID;
  cases_id UUID;
BEGIN
  -- Get iPad Accessories category ID
  SELECT id INTO ipad_category_id
  FROM public.categories
  WHERE slug = 'ipad-accessories'
  LIMIT 1;

  IF ipad_category_id IS NOT NULL THEN
    -- Insert Pencils subcategory
    INSERT INTO public.categories (name, slug, description, image_url, parent_id, display_order, is_active)
    VALUES (
      'Pencils',
      'pencils',
      'iPad pencils and styluses',
      'https://c1.neweggimages.com/productimage/nb640/B39GS24052906CQSZ16.jpg',
      ipad_category_id,
      1,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        parent_id = EXCLUDED.parent_id,
        display_order = EXCLUDED.display_order
    RETURNING id INTO pencils_id;

    -- Insert Keyboards and Mice subcategory
    INSERT INTO public.categories (name, slug, description, image_url, parent_id, display_order, is_active)
    VALUES (
      'Keyboards and Mice',
      'keyboards-mice',
      'iPad keyboards and mice',
      'https://m.media-amazon.com/images/I/61PwCPnxrfL.jpg',
      ipad_category_id,
      2,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        parent_id = EXCLUDED.parent_id,
        display_order = EXCLUDED.display_order
    RETURNING id INTO keyboards_mice_id;

    -- Insert Stands subcategory
    INSERT INTO public.categories (name, slug, description, image_url, parent_id, display_order, is_active)
    VALUES (
      'Stands',
      'stands',
      'iPad stands and holders',
      'https://i.ebayimg.com/images/g/QlQAAOSwQoZjoUYt/s-l1200.jpg',
      ipad_category_id,
      3,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        parent_id = EXCLUDED.parent_id,
        display_order = EXCLUDED.display_order
    RETURNING id INTO stands_id;

    -- Insert Cases subcategory (Coming Soon)
    INSERT INTO public.categories (name, slug, description, image_url, parent_id, display_order, is_active)
    VALUES (
      'Cases',
      'cases',
      'iPad cases and covers (Coming Soon)',
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MDEQ4?wid=890&hei=890&fmt=jpeg&qlt=90&.v=1739826847442',
      ipad_category_id,
      4,
      true
    )
    ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        description = EXCLUDED.description,
        image_url = EXCLUDED.image_url,
        parent_id = EXCLUDED.parent_id,
        display_order = EXCLUDED.display_order
    RETURNING id INTO cases_id;

    -- Log success
    RAISE NOTICE 'iPad Accessories subcategories created successfully!';
    RAISE NOTICE 'Pencils ID: %', pencils_id;
    RAISE NOTICE 'Keyboards & Mice ID: %', keyboards_mice_id;
    RAISE NOTICE 'Stands ID: %', stands_id;
    RAISE NOTICE 'Cases ID: %', cases_id;
  ELSE
    RAISE NOTICE 'iPad Accessories category not found!';
  END IF;
END $$;

-- Verify the subcategories
SELECT 
  c.name as subcategory_name,
  c.slug as subcategory_slug,
  p.name as parent_name,
  c.display_order,
  c.is_active
FROM public.categories c
LEFT JOIN public.categories p ON c.parent_id = p.id
WHERE p.slug = 'ipad-accessories'
ORDER BY c.display_order;
