-- COMPLETE STOCK MANAGEMENT SYSTEM
-- This will set up proper stock tracking for your e-commerce store

-- 1. Ensure stock columns exist with proper defaults
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'out_of_stock';

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS track_stock BOOLEAN DEFAULT true;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON public.products(stock_status);

-- 3. Create function to automatically update stock_status based on stock_quantity
CREATE OR REPLACE FUNCTION update_product_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update status if stock tracking is enabled
    IF NEW.track_stock = true THEN
        IF NEW.stock_quantity <= 0 THEN
            NEW.stock_status = 'out_of_stock';
        ELSIF NEW.stock_quantity <= NEW.low_stock_threshold THEN
            NEW.stock_status = 'low_stock';
        ELSE
            NEW.stock_status = 'in_stock';
        END IF;
    ELSE
        -- If stock tracking is disabled, always show as in stock
        NEW.stock_status = 'in_stock';
    END IF;
    
    -- Update the updated_at timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create triggers for automatic status updates
DROP TRIGGER IF EXISTS trigger_update_product_stock_status ON public.products;
CREATE TRIGGER trigger_update_product_stock_status
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    WHEN (OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity 
          OR OLD.low_stock_threshold IS DISTINCT FROM NEW.low_stock_threshold
          OR OLD.track_stock IS DISTINCT FROM NEW.track_stock)
    EXECUTE FUNCTION update_product_stock_status();

-- 5. Create trigger for new products
DROP TRIGGER IF EXISTS trigger_insert_product_stock_status ON public.products;
CREATE TRIGGER trigger_insert_product_stock_status
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock_status();

-- 6. Update existing products to have correct stock_status
UPDATE public.products 
SET stock_status = CASE 
    WHEN track_stock = false THEN 'in_stock'
    WHEN stock_quantity <= 0 THEN 'out_of_stock'
    WHEN stock_quantity <= COALESCE(low_stock_threshold, 5) THEN 'low_stock'
    ELSE 'in_stock'
END,
updated_at = CURRENT_TIMESTAMP;

-- 7. Set reasonable default stock for existing products (you can adjust these)
-- Comment out this line if you want to set stock manually for each product
UPDATE public.products 
SET stock_quantity = 10, low_stock_threshold = 3 
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- 8. Create a view for easy stock monitoring
CREATE OR REPLACE VIEW admin_stock_overview AS
SELECT 
    id,
    name,
    price,
    stock_quantity,
    stock_status,
    low_stock_threshold,
    track_stock,
    updated_at,
    CASE 
        WHEN stock_status = 'out_of_stock' THEN 1
        WHEN stock_status = 'low_stock' THEN 2
        ELSE 3
    END as priority_order
FROM public.products
WHERE track_stock = true
ORDER BY priority_order, stock_quantity ASC, name;

-- 9. Show current stock status
SELECT 
    name,
    stock_quantity,
    stock_status,
    low_stock_threshold,
    track_stock
FROM admin_stock_overview
LIMIT 20;