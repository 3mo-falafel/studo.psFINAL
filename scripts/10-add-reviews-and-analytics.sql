-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Analytics Table
CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  views_count INTEGER DEFAULT 0,
  views_today INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  sales_today INTEGER DEFAULT 0,
  last_view_at TIMESTAMP WITH TIME ZONE,
  last_sale_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Wishlist Shares Table
CREATE TABLE IF NOT EXISTS wishlist_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Add best_seller flag to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT FALSE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_shares_code ON wishlist_shares(share_code);

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;
CREATE POLICY "Anyone can read approved reviews"
  ON product_reviews FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can insert reviews" ON product_reviews;
CREATE POLICY "Anyone can insert reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage reviews" ON product_reviews;
CREATE POLICY "Admins can manage reviews"
  ON product_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for product_analytics (read-only for public)
DROP POLICY IF EXISTS "Anyone can read analytics" ON product_analytics;
CREATE POLICY "Anyone can read analytics"
  ON product_analytics FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage analytics" ON product_analytics;
CREATE POLICY "Service role can manage analytics"
  ON product_analytics FOR ALL
  USING (
    auth.role() = 'service_role'
  );

-- RLS Policies for wishlist_shares
DROP POLICY IF EXISTS "Anyone can read by share code" ON wishlist_shares;
CREATE POLICY "Anyone can read by share code"
  ON wishlist_shares FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage their shares" ON wishlist_shares;
CREATE POLICY "Users can manage their shares"
  ON wishlist_shares FOR ALL
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_analytics_updated_at ON product_analytics;
CREATE TRIGGER update_product_analytics_updated_at BEFORE UPDATE ON product_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset daily counters (run via cron job)
CREATE OR REPLACE FUNCTION reset_daily_counters()
RETURNS void AS $$
BEGIN
  UPDATE product_analytics
  SET views_today = 0, sales_today = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate best sellers (run periodically)
CREATE OR REPLACE FUNCTION update_best_sellers()
RETURNS void AS $$
BEGIN
  -- Mark top 20% of products by sales as best sellers
  UPDATE products
  SET best_seller = (
    id IN (
      SELECT pa.product_id
      FROM product_analytics pa
      ORDER BY pa.sales_count DESC
      LIMIT (SELECT COUNT(*) * 0.2 FROM products WHERE is_active = true)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate trending products (high views + recent sales)
CREATE OR REPLACE FUNCTION update_trending_products()
RETURNS void AS $$
BEGIN
  -- Products with high activity in last 7 days
  UPDATE products
  SET trending = (
    id IN (
      SELECT pa.product_id
      FROM product_analytics pa
      WHERE pa.last_view_at >= NOW() - INTERVAL '7 days'
        AND pa.views_today > 10
        AND pa.sales_count > 0
      ORDER BY (pa.views_today * 0.7 + pa.sales_today * 0.3) DESC
      LIMIT 20
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Initialize analytics for existing products
INSERT INTO product_analytics (product_id, views_count, sales_count)
SELECT id, 0, 0
FROM products
ON CONFLICT (product_id) DO NOTHING;

-- Function to increment product view (efficient upsert)
CREATE OR REPLACE FUNCTION increment_product_view(p_product_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO product_analytics (
    product_id, 
    views_count, 
    views_today, 
    sales_count, 
    sales_today,
    last_view_at
  )
  VALUES (
    p_product_id, 
    1, 
    1, 
    0, 
    0,
    NOW()
  )
  ON CONFLICT (product_id) 
  DO UPDATE SET
    views_count = product_analytics.views_count + 1,
    views_today = product_analytics.views_today + 1,
    last_view_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment sales (call this after order completion)
CREATE OR REPLACE FUNCTION increment_product_sales(p_product_id UUID, p_quantity INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE product_analytics
  SET 
    sales_count = sales_count + p_quantity,
    sales_today = sales_today + p_quantity,
    last_sale_at = NOW()
  WHERE product_id = p_product_id;
  
  -- If no row exists, insert one
  IF NOT FOUND THEN
    INSERT INTO product_analytics (
      product_id, 
      views_count, 
      views_today,
      sales_count, 
      sales_today,
      last_sale_at
    )
    VALUES (
      p_product_id, 
      0, 
      0,
      p_quantity, 
      p_quantity,
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_product_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_product_sales(UUID, INTEGER) TO anon, authenticated;

-- Drop existing function if it exists (needed when changing return type)
DROP FUNCTION IF EXISTS get_suggested_products(UUID, INTEGER);

-- Function to get suggested products (related + complementary)
CREATE OR REPLACE FUNCTION get_suggested_products(
  p_product_id UUID,
  p_limit INTEGER DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price NUMERIC,
  compare_at_price NUMERIC,
  images TEXT[],
  category_id UUID,
  best_seller BOOLEAN,
  trending BOOLEAN,
  is_related BOOLEAN,
  quantity INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH current_product AS (
    SELECT p.category_id, p.price
    FROM products p
    WHERE p.id = p_product_id
  ),
  related_products AS (
    -- Get products from SAME category (excluding current product)
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.price,
      p.compare_at_price,
      p.images,
      p.category_id,
      p.best_seller,
      p.trending,
      true as is_related,
      p.quantity,
      pa.views_count,
      pa.sales_count
    FROM products p
    LEFT JOIN product_analytics pa ON p.id = pa.product_id
    CROSS JOIN current_product cp
    WHERE p.category_id = cp.category_id
      AND p.id != p_product_id
      AND p.is_active = true
      AND p.quantity > 0
    ORDER BY 
      -- Prioritize best sellers and trending
      (CASE WHEN p.best_seller THEN 2 ELSE 0 END + 
       CASE WHEN p.trending THEN 1 ELSE 0 END) DESC,
      -- Then by popularity
      COALESCE(pa.views_count, 0) + COALESCE(pa.sales_count, 0) * 5 DESC,
      -- Then by price similarity
      ABS(p.price - cp.price) ASC
    LIMIT GREATEST(p_limit / 2, 4)
  ),
  complementary_products AS (
    -- Get products from DIFFERENT categories (complementary items)
    SELECT 
      p.id,
      p.name,
      p.slug,
      p.price,
      p.compare_at_price,
      p.images,
      p.category_id,
      p.best_seller,
      p.trending,
      false as is_related,
      p.quantity,
      pa.views_count,
      pa.sales_count
    FROM products p
    LEFT JOIN product_analytics pa ON p.id = pa.product_id
    CROSS JOIN current_product cp
    WHERE p.category_id != cp.category_id
      AND p.id != p_product_id
      AND p.is_active = true
      AND p.quantity > 0
      -- Prefer products in similar price range for complementary
      AND p.price BETWEEN cp.price * 0.3 AND cp.price * 2
    ORDER BY 
      -- Prioritize best sellers and trending
      (CASE WHEN p.best_seller THEN 2 ELSE 0 END + 
       CASE WHEN p.trending THEN 1 ELSE 0 END) DESC,
      -- Then by popularity
      COALESCE(pa.views_count, 0) + COALESCE(pa.sales_count, 0) * 5 DESC,
      -- Random factor for variety
      RANDOM()
    LIMIT GREATEST(p_limit / 2, 4)
  )
  -- Combine both sets (exclude views_count and sales_count from final output)
  SELECT 
    rp.id, rp.name, rp.slug, rp.price, rp.compare_at_price, 
    rp.images, rp.category_id, rp.best_seller, rp.trending, 
    rp.is_related, rp.quantity
  FROM related_products rp
  UNION ALL
  SELECT 
    cp.id, cp.name, cp.slug, cp.price, cp.compare_at_price, 
    cp.images, cp.category_id, cp.best_seller, cp.trending, 
    cp.is_related, cp.quantity
  FROM complementary_products cp
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_suggested_products(UUID, INTEGER) TO anon, authenticated;
