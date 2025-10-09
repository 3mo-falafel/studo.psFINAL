-- Add stock management to products table
-- This will enable proper stock tracking and decreasing stock on checkout

-- Add stock_quantity column if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 10;

-- Add stock_status column for better stock management
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';

-- Set initial stock for existing products (you can adjust these numbers)
UPDATE public.products 
SET stock_quantity = 25, stock_status = 'in_stock' 
WHERE stock_quantity IS NULL;

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);

-- Create a function to automatically update stock_status based on stock_quantity
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_quantity <= 0 THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.stock_quantity <= 5 THEN
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'in_stock';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update stock_status when stock_quantity changes
DROP TRIGGER IF EXISTS trigger_update_stock_status ON public.products;
CREATE TRIGGER trigger_update_stock_status
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity)
    EXECUTE FUNCTION update_stock_status();

-- Also update stock_status for initial insert
DROP TRIGGER IF EXISTS trigger_insert_stock_status ON public.products;
CREATE TRIGGER trigger_insert_stock_status
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_status();

-- Update existing products to have correct stock_status
UPDATE public.products 
SET stock_status = CASE 
    WHEN stock_quantity <= 0 THEN 'out_of_stock'
    WHEN stock_quantity <= 5 THEN 'low_stock'
    ELSE 'in_stock'
END;

-- Check the results
SELECT id, name, stock_quantity, stock_status 
FROM public.products 
ORDER BY name 
LIMIT 10;