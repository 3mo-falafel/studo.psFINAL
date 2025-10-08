-- Create discount_codes table for auto-generated loyalty codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  min_purchase DECIMAL(10, 2) NOT NULL DEFAULT 0,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_in_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_user_id ON discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_is_used ON discount_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires_at ON discount_codes(expires_at);

-- Enable RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read discount codes (for validation)
CREATE POLICY "Anyone can read discount codes"
  ON discount_codes
  FOR SELECT
  USING (true);

-- Policy: System can insert discount codes (from orders API)
CREATE POLICY "System can insert discount codes"
  ON discount_codes
  FOR INSERT
  WITH CHECK (true);

-- Policy: System can update discount codes (mark as used)
CREATE POLICY "System can update discount codes"
  ON discount_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add comment to explain the table
COMMENT ON TABLE discount_codes IS 'Auto-generated discount codes given to customers based on purchase amount. Single-use only.';
