-- Create table for category showcase images
-- Allows admin to manage images for the 4 category boxes on homepage
-- Each category_slot (1-4) can have multiple images that rotate

CREATE TABLE IF NOT EXISTS public.category_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slot INTEGER NOT NULL CHECK (category_slot >= 1 AND category_slot <= 4),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_category_images_slot_order 
ON public.category_images(category_slot, display_order);

-- Enable RLS
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view category images" ON public.category_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert category images" ON public.category_images
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update category images" ON public.category_images
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete category images" ON public.category_images
  FOR DELETE USING (is_admin());

-- Insert default category slot mappings
-- Slot 1: iPad Pencils
-- Slot 2: AirPods  
-- Slot 3: Chargers
-- Slot 4: Printed Stuff
INSERT INTO public.category_images (category_slot, image_url, display_order, is_active)
VALUES 
  (1, '/placeholder.svg', 0, false),
  (2, '/placeholder.svg', 0, false),
  (3, '/placeholder.svg', 0, false),
  (4, '/placeholder.svg', 0, false)
ON CONFLICT DO NOTHING;
