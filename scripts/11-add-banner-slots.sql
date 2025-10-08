-- Update banners table to support banner slots with multiple rotating offers
-- Each banner slot (1, 2, 3) can have multiple offers that rotate

-- Add banner_slot column to organize banners into 3 slots
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS banner_slot INTEGER DEFAULT 1;

-- Add a constraint to ensure banner_slot is between 1 and 3
ALTER TABLE public.banners 
ADD CONSTRAINT banner_slot_range CHECK (banner_slot >= 1 AND banner_slot <= 3);

-- Update display_order to be unique within each banner_slot for rotation order
-- Drop the old index if exists
DROP INDEX IF EXISTS idx_banners_display_order;

-- Create new index for banner_slot and display_order
CREATE INDEX IF NOT EXISTS idx_banners_slot_order ON public.banners(banner_slot, display_order);

-- Update existing banners to use banner slots based on their display_order
UPDATE public.banners 
SET banner_slot = CASE 
  WHEN display_order = 1 THEN 1
  WHEN display_order = 2 THEN 2
  WHEN display_order = 3 THEN 3
  ELSE 1
END
WHERE banner_slot IS NULL OR banner_slot = 1;

-- Create a view to easily see banners by slot
CREATE OR REPLACE VIEW banners_by_slot AS
SELECT 
  banner_slot,
  COUNT(*) as total_offers,
  COUNT(*) FILTER (WHERE is_active = true) as active_offers,
  array_agg(id ORDER BY display_order) as banner_ids
FROM public.banners
GROUP BY banner_slot
ORDER BY banner_slot;
