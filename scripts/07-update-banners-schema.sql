-- Update banners table to include position field if it doesn't exist
ALTER TABLE banners ADD COLUMN IF NOT EXISTS position VARCHAR(20) DEFAULT 'large';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS badge_text VARCHAR(100);
ALTER TABLE banners ADD COLUMN IF NOT EXISTS button_link TEXT;

-- Update existing banners to have proper position values
UPDATE banners SET position = 'large' WHERE display_order <= 2;
UPDATE banners SET position = 'small' WHERE display_order > 2;
