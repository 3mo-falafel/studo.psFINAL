-- Fix RLS policies to allow guest users to place orders and submit reviews

-- 1. Allow anyone to insert orders (guest checkout)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 2. Allow users to view their own orders or orders without user_id (guest orders)
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated, anon
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 3. Allow anyone to insert order items
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 4. Allow anyone to view order items
DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
CREATE POLICY "Anyone can view order items"
  ON order_items
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 5. Allow anyone to submit product reviews (pending approval)
DROP POLICY IF EXISTS "Anyone can submit reviews" ON product_reviews;
CREATE POLICY "Anyone can submit reviews"
  ON product_reviews
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (is_approved = false);

-- 6. Allow anyone to read approved reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;
CREATE POLICY "Anyone can read approved reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated, anon
  USING (is_approved = true);

-- 7. Allow anyone to submit testimonials (pending approval)
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON testimonials;
CREATE POLICY "Anyone can submit testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (is_approved = false);

-- 8. Allow anyone to read approved testimonials
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON testimonials;
CREATE POLICY "Anyone can read approved testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated, anon
  USING (is_approved = true);

-- 9. Allow anyone to read products (for stock validation)
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 10. Allow API to update product stock
DROP POLICY IF EXISTS "Service role can update products" ON products;
CREATE POLICY "Service role can update products"
  ON products
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- 11. Allow anyone to read discount codes
DROP POLICY IF EXISTS "Anyone can read discount codes" ON discount_codes;
CREATE POLICY "Anyone can read discount codes"
  ON discount_codes
  FOR SELECT
  TO authenticated, anon
  USING (is_used = false AND expires_at > NOW());

-- 12. Allow anyone to insert discount codes (earned from orders)
DROP POLICY IF EXISTS "Anyone can create discount codes" ON discount_codes;
CREATE POLICY "Anyone can create discount codes"
  ON discount_codes
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 13. Allow anyone to update discount codes (mark as used)
DROP POLICY IF EXISTS "Anyone can update discount codes" ON discount_codes;
CREATE POLICY "Anyone can update discount codes"
  ON discount_codes
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE orders IS 'Guest users can place orders without authentication';
COMMENT ON TABLE product_reviews IS 'Guest users can submit reviews pending admin approval';
COMMENT ON TABLE testimonials IS 'Guest users can submit testimonials pending admin approval';
