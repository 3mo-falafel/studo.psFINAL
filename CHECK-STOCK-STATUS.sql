-- Test if the stock fix is working
-- Run this to see current stock levels and verify they're updating correctly

-- Check your specific products
SELECT 
    name,
    stock_quantity,
    stock_status,
    low_stock_threshold,
    track_stock,
    updated_at
FROM public.products 
WHERE name IN ('Ds', 'Sd')
ORDER BY name;

-- Check all products stock status
SELECT 
    name,
    stock_quantity,
    stock_status,
    CASE 
        WHEN stock_status = 'out_of_stock' THEN '🚨 OUT OF STOCK - NEEDS RESTOCKING'
        WHEN stock_status = 'low_stock' THEN '⚠️ LOW STOCK - CONSIDER RESTOCKING'
        ELSE '✅ IN STOCK'
    END as alert_level
FROM public.products 
WHERE track_stock = true
ORDER BY 
    CASE stock_status 
        WHEN 'out_of_stock' THEN 1
        WHEN 'low_stock' THEN 2  
        ELSE 3
    END,
    stock_quantity ASC,
    name;