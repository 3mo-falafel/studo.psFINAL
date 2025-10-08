-- Seed sample products for testing

-- Insert sample products for iPad Accessories
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, images, is_featured, is_active) 
SELECT 
  'iPad Pro Case - Premium Leather',
  'ipad-pro-case-premium-leather',
  'High-quality leather case for iPad Pro with multiple viewing angles and auto sleep/wake function.',
  149.99,
  199.99,
  id,
  50,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'ipad-accessories' LIMIT 1;

INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'iPad Air Smart Cover',
  'ipad-air-smart-cover',
  'Slim and lightweight smart cover for iPad Air with magnetic attachment.',
  79.99,
  id,
  75,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'ipad-accessories' LIMIT 1;

-- Insert sample products for AirPods
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'AirPods Pro Silicone Case',
  'airpods-pro-silicone-case',
  'Protective silicone case for AirPods Pro with carabiner clip.',
  29.99,
  39.99,
  id,
  100,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'airpods' LIMIT 1;

-- Insert sample products for Phone Accessories
INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'iPhone 15 Pro Max Case - Clear',
  'iphone-15-pro-max-case-clear',
  'Crystal clear case with military-grade drop protection.',
  49.99,
  id,
  120,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'phone-accessories' LIMIT 1;

INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_active)
SELECT 
  'Phone Ring Holder - 360° Rotation',
  'phone-ring-holder-360',
  'Universal phone ring holder with 360° rotation and magnetic car mount.',
  19.99,
  id,
  200,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true
FROM categories WHERE slug = 'phone-accessories' LIMIT 1;

-- Insert sample products for Chargers
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'Fast Charger 65W USB-C',
  'fast-charger-65w-usb-c',
  'GaN technology fast charger with 65W power delivery for laptops and phones.',
  89.99,
  129.99,
  id,
  80,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'chargers' LIMIT 1;

INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'Wireless Charging Pad - 15W',
  'wireless-charging-pad-15w',
  'Fast wireless charging pad compatible with iPhone and Android devices.',
  39.99,
  id,
  150,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'chargers' LIMIT 1;

-- Insert sample products for Bags
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'Premium Laptop Bag 15.6"',
  'premium-laptop-bag-15-6',
  'Water-resistant laptop bag with multiple compartments and padded shoulder strap.',
  129.99,
  179.99,
  id,
  40,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'bags' LIMIT 1;

-- Insert sample products for Computer Accessories
INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_active)
SELECT 
  'Wireless Mouse - Ergonomic',
  'wireless-mouse-ergonomic',
  'Ergonomic wireless mouse with adjustable DPI and long battery life.',
  59.99,
  id,
  90,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true
FROM categories WHERE slug = 'computer-accessories' LIMIT 1;

-- Insert sample products for Hard Disks
INSERT INTO products (name, slug, description, price, category_id, stock_quantity, images, is_featured, is_active)
SELECT 
  'External SSD 1TB - Portable',
  'external-ssd-1tb-portable',
  'Ultra-fast portable SSD with USB 3.2 Gen 2 for quick file transfers.',
  199.99,
  id,
  60,
  ARRAY['/placeholder.svg?height=400&width=400'],
  true,
  true
FROM categories WHERE slug = 'hard-disks' LIMIT 1;
