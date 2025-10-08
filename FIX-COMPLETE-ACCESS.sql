-- COMPLETE FIX: Allow EVERYONE (logged in or guest) to do EVERYTHING needed for e-commerce
-- This removes ALL restrictions for guest checkout and reviews

-- ============================================================================
-- ORDERS - Allow everyone to create and view orders
-- ============================================================================

-- Drop all existing order policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable read for all users" ON orders;

-- Create simple policies: everyone can insert and select
CREATE POLICY "enable_insert_for_all" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_select_for_all" ON orders FOR SELECT USING (true);
CREATE POLICY "enable_update_for_all" ON orders FOR UPDATE USING (true);

-- ============================================================================
-- ORDER ITEMS - Allow everyone to create and view
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
DROP POLICY IF EXISTS "Enable insert for all users" ON order_items;
DROP POLICY IF EXISTS "Enable read for all users" ON order_items;

CREATE POLICY "enable_insert_for_all" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_select_for_all" ON order_items FOR SELECT USING (true);

-- ============================================================================
-- PRODUCTS - Allow everyone to read and update (for stock management)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Service role can update products" ON products;
DROP POLICY IF EXISTS "Enable read for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;

CREATE POLICY "enable_select_for_all" ON products FOR SELECT USING (true);
CREATE POLICY "enable_update_for_all" ON products FOR UPDATE USING (true);
CREATE POLICY "enable_insert_for_all" ON products FOR INSERT WITH CHECK (true);

-- ============================================================================
-- PRODUCT REVIEWS - Allow everyone to submit and read
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit reviews" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;
DROP POLICY IF EXISTS "Enable insert for all users" ON product_reviews;
DROP POLICY IF EXISTS "Enable read for all users" ON product_reviews;

CREATE POLICY "enable_insert_for_all" ON product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_select_for_all" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "enable_update_for_all" ON product_reviews FOR UPDATE USING (true);
CREATE POLICY "enable_delete_for_all" ON product_reviews FOR DELETE USING (true);

-- ============================================================================
-- SITE TESTIMONIALS - Allow everyone to submit and read
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;
DROP POLICY IF EXISTS "Enable insert for all users" ON site_testimonials;
DROP POLICY IF EXISTS "Enable read for all users" ON site_testimonials;

CREATE POLICY "enable_insert_for_all" ON site_testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_select_for_all" ON site_testimonials FOR SELECT USING (true);
CREATE POLICY "enable_update_for_all" ON site_testimonials FOR UPDATE USING (true);
CREATE POLICY "enable_delete_for_all" ON site_testimonials FOR DELETE USING (true);

-- ============================================================================
-- DISCOUNT CODES - Allow everyone to read, insert, and update
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Anyone can create discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Anyone can update discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Enable read for all users" ON discount_codes;
DROP POLICY IF EXISTS "Enable insert for all users" ON discount_codes;
DROP POLICY IF EXISTS "Enable update for all users" ON discount_codes;

CREATE POLICY "enable_select_for_all" ON discount_codes FOR SELECT USING (true);
CREATE POLICY "enable_insert_for_all" ON discount_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "enable_update_for_all" ON discount_codes FOR UPDATE USING (true);

-- ============================================================================
-- CATEGORIES - Allow everyone to read
-- ============================================================================

DROP POLICY IF EXISTS "Enable read for all users" ON categories;
CREATE POLICY "enable_select_for_all" ON categories FOR SELECT USING (true);

-- ============================================================================
-- BANNERS - Allow everyone to read
-- ============================================================================

DROP POLICY IF EXISTS "Enable read for all users" ON banners;
CREATE POLICY "enable_select_for_all" ON banners FOR SELECT USING (true);

-- Done! Everyone can now checkout and submit reviews regardless of login status
SELECT 'SUCCESS! All tables are now accessible to everyone.' as status;
