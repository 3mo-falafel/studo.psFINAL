-- Update AirPods to Headphones
UPDATE public.categories 
SET 
  name = 'Headphones',
  description = 'Headphones and wireless earbuds'
WHERE slug = 'airpods';

-- Update Bags to include "Coming Soon"
UPDATE public.categories 
SET name = 'Bags (Coming Soon)'
WHERE slug = 'bags';
