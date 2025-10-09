-- Set your specific products to their real stock quantities
-- Replace these with the actual stock you have

-- Set "Ds" and "Sd" to 1 stock each (as shown in your image)
UPDATE public.products 
SET stock_quantity = 1, low_stock_threshold = 1 
WHERE name IN ('Ds', 'Sd');

-- You can add more products here with their real stock
-- UPDATE public.products 
-- SET stock_quantity = 5 
-- WHERE name = 'Another Product';

-- Check the results
SELECT name, stock_quantity, stock_status, low_stock_threshold 
FROM public.products 
ORDER BY stock_quantity ASC, name;