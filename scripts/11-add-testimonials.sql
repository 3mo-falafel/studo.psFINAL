-- Site-wide Testimonials Table (for footer reviews)
CREATE TABLE IF NOT EXISTS site_testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_site_testimonials_approved ON site_testimonials(is_approved);

-- Enable RLS
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;
CREATE POLICY "Anyone can read approved testimonials"
  ON site_testimonials FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON site_testimonials;
CREATE POLICY "Anyone can insert testimonials"
  ON site_testimonials FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage testimonials" ON site_testimonials;
CREATE POLICY "Admins can manage testimonials"
  ON site_testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_site_testimonials_updated_at ON site_testimonials;
CREATE TRIGGER update_site_testimonials_updated_at BEFORE UPDATE ON site_testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
