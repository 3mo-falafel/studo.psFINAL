-- Add new columns to banners table for countdown and discount features
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER,
ADD COLUMN IF NOT EXISTS countdown_end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

-- Rename image_url to be clearer (optional, for consistency)
-- If you want to keep both, comment this out
-- ALTER TABLE public.banners RENAME COLUMN image_url TO background_image_url;

-- Update existing banners to use background_image_url if not set
UPDATE public.banners 
SET background_image_url = image_url 
WHERE background_image_url IS NULL AND image_url IS NOT NULL;

-- Create a function to automatically deactivate expired banners
CREATE OR REPLACE FUNCTION deactivate_expired_banners()
RETURNS void AS $$
BEGIN
  UPDATE public.banners
  SET is_active = false
  WHERE countdown_end_time IS NOT NULL 
    AND countdown_end_time < NOW()
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to check for expired banners on each query
-- Note: For better performance, you might want to use a scheduled job instead
CREATE OR REPLACE FUNCTION check_banner_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.countdown_end_time IS NOT NULL AND NEW.countdown_end_time < NOW() THEN
    NEW.is_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS banner_expiry_check ON public.banners;
CREATE TRIGGER banner_expiry_check
  BEFORE INSERT OR UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION check_banner_expiry();

-- Add index for countdown queries
CREATE INDEX IF NOT EXISTS idx_banners_countdown ON public.banners(countdown_end_time) 
WHERE countdown_end_time IS NOT NULL;
