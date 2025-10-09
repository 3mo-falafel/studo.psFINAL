-- Update stock management to show "low stock" when quantity is less than 10
-- This ensures "Only X left" message appears earlier (as requested)

-- Update the stock status function to use 10 as the low stock threshold
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= 0 THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.stock_quantity < 10 THEN
        -- Changed from <= 5 to < 10 for earlier low stock warning
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'in_stock';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update all existing products to reflect the new threshold
UPDATE public.products 
SET stock_status = CASE 
    WHEN stock_quantity <= 0 THEN 'out_of_stock'
    WHEN stock_quantity < 10 THEN 'low_stock'
    ELSE 'in_stock'
END;

-- Verify the changes
SELECT 
    stock_status,
    COUNT(*) as product_count,
    MIN(stock_quantity) as min_stock,
    MAX(stock_quantity) as max_stock
FROM public.products 
GROUP BY stock_status
ORDER BY 
    CASE stock_status 
        WHEN 'out_of_stock' THEN 1 
        WHEN 'low_stock' THEN 2 
        ELSE 3 
    END;

-- Show products with low stock (< 10)
SELECT id, name, stock_quantity, stock_status 
FROM public.products 
WHERE stock_quantity < 10 AND stock_quantity > 0
ORDER BY stock_quantity ASC
LIMIT 20;
