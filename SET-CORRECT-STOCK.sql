-- Fix stock quantities for the two specific products
-- Set "Ds" and "Sd" products to have only 1 stock each (as shown in the UI)

-- Update the specific products to have correct stock
UPDATE public.products 
SET stock_quantity = 1
WHERE name IN ('Ds', 'Sd');

-- Check the results
SELECT id, name, stock_quantity, stock_status 
FROM public.products 
WHERE name IN ('Ds', 'Sd')
ORDER BY name;