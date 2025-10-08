-- Seed promotional banners

-- Large banner 1 - iPad Accessories
INSERT INTO banners (title, subtitle, button_text, button_link, image_url, position, badge_text, is_active, display_order)
VALUES (
  'New iPad Accessories',
  'Protect your device in style',
  'Shop Now',
  '/categories/ipad-accessories',
  '/placeholder.svg?height=600&width=800',
  'large',
  'Featured Offer',
  true,
  1
);

-- Large banner 2 - Special Sale
INSERT INTO banners (title, subtitle, button_text, button_link, image_url, position, badge_text, is_active, display_order)
VALUES (
  'Summer Sale - Up to 40% Off',
  'Limited time offer on selected items',
  'Shop Sale',
  '/shop?sale=true',
  '/placeholder.svg?height=600&width=800',
  'large',
  'Limited Time',
  true,
  2
);

-- Small banner 1 - Laptop Bags
INSERT INTO banners (title, subtitle, button_text, button_link, image_url, position, badge_text, is_active, display_order)
VALUES (
  'Premium Laptop Bags',
  'Carry your tech with confidence',
  'Explore Collection',
  '/categories/bags',
  '/placeholder.svg?height=400&width=600',
  'small',
  'Special Deal',
  true,
  3
);

-- Small banner 2 - Chargers
INSERT INTO banners (title, subtitle, button_text, button_link, image_url, position, badge_text, is_active, display_order)
VALUES (
  'Fast Charging Solutions',
  'Power up in minutes',
  'View Products',
  '/categories/chargers',
  '/placeholder.svg?height=400&width=600',
  'small',
  'Limited Time',
  true,
  4
);
