-- Insert sample categories
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('iPad Accessories', 'ipad-accessories', 'Cases, covers, and accessories for iPad', 1),
  ('Bags (Coming Soon)', 'bags', 'Laptop bags, backpacks, and carrying cases', 2),
  ('Headphones', 'airpods', 'Headphones and wireless earbuds', 3),
  ('IPTV Subscriptions', 'phone-accessories', 'Advanced TV streaming service with 7,000+ channels, 7,000+ series, and 18,000+ movies in HD & 4K quality. Compatible with all devices (phone, tablet, smart TV, computer), 24/7 technical support, continuous content updates, easy-to-use interface, and competitive pricing with flexible plans.', 4),
  ('Computer Accessories', 'computer-accessories', 'Keyboards, mice, and computer peripherals', 5),
  ('Chargers', 'chargers', 'Fast chargers and charging cables', 6),
  ('Hard Disks', 'hard-disks', 'External storage and hard drives', 7),
  ('Printed Stuff', 'printed-stuff', 'Custom printed items and merchandise', 8),
  ('Gift Packages', 'gift-packages', 'Curated gift sets and bundles', 9)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample banners
INSERT INTO public.banners (title, subtitle, image_url, button_text, display_order) VALUES
  ('New iPad Accessories', 'Protect your device in style', '/placeholder.svg?height=600&width=1920', 'Shop Now', 1),
  ('Premium Laptop Bags', 'Carry your tech with confidence', '/placeholder.svg?height=600&width=1920', 'Explore Collection', 2),
  ('Fast Charging Solutions', 'Power up in minutes', '/placeholder.svg?height=600&width=1920', 'View Products', 3)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, compare_at_price, sku, quantity, category_id, images, is_featured) 
SELECT 
  'iPad Pro 12.9" Leather Case',
  'ipad-pro-leather-case',
  'Premium leather case for iPad Pro 12.9 inch with auto sleep/wake function',
  4999.00,
  6999.00,
  'IPAD-CASE-001',
  50,
  c.id,
  ARRAY['/placeholder.svg?height=800&width=800'],
  true
FROM public.categories c WHERE c.slug = 'ipad-accessories'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, sku, quantity, category_id, images, is_featured)
SELECT 
  'Professional Laptop Backpack',
  'professional-laptop-backpack',
  'Water-resistant backpack with padded laptop compartment up to 15.6 inches',
  8999.00,
  'BAG-BP-001',
  30,
  c.id,
  ARRAY['/placeholder.svg?height=800&width=800'],
  true
FROM public.categories c WHERE c.slug = 'bags'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, compare_at_price, sku, quantity, category_id, images, is_featured)
SELECT 
  'AirPods Pro Silicone Case',
  'airpods-pro-case',
  'Protective silicone case for AirPods Pro with carabiner clip',
  1299.00,
  1999.00,
  'AIRPODS-CASE-001',
  100,
  c.id,
  ARRAY['/placeholder.svg?height=800&width=800'],
  false
FROM public.categories c WHERE c.slug = 'airpods'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, sku, quantity, category_id, images, is_featured)
SELECT 
  '65W GaN Fast Charger',
  '65w-gan-charger',
  'Compact GaN technology charger with dual USB-C ports',
  3499.00,
  'CHARGER-GAN-001',
  75,
  c.id,
  ARRAY['/placeholder.svg?height=800&width=800'],
  true
FROM public.categories c WHERE c.slug = 'chargers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, price, sku, quantity, category_id, images)
SELECT 
  '1TB External SSD',
  '1tb-external-ssd',
  'Portable external SSD with USB 3.2 Gen 2 for fast data transfer',
  12999.00,
  'HDD-SSD-001',
  40,
  c.id,
  ARRAY['/placeholder.svg?height=800&width=800']
FROM public.categories c WHERE c.slug = 'hard-disks'
ON CONFLICT (slug) DO NOTHING;
