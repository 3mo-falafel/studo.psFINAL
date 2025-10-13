-- Update Phone Accessories category to IPTV Subscriptions
-- Run this SQL in your Supabase SQL Editor to update the existing database

UPDATE public.categories 
SET 
  name = 'IPTV Subscriptions',
  description = 'Advanced TV streaming service with 7,000+ channels, 7,000+ series, and 18,000+ movies in HD & 4K quality. Compatible with all devices (phone, tablet, smart TV, computer), 24/7 technical support, continuous content updates, easy-to-use interface, and competitive pricing with flexible plans.'
WHERE slug = 'phone-accessories';

-- Verify the update
SELECT id, name, slug, description, display_order 
FROM public.categories 
WHERE slug = 'phone-accessories';
