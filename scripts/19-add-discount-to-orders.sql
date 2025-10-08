-- Add discount fields to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS discount_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- Add index for faster discount code lookups
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);

-- Add comment
COMMENT ON COLUMN orders.discount_code IS 'The discount code used for this order (if any)';
COMMENT ON COLUMN orders.discount_amount IS 'The discount amount applied to this order in ILS';
