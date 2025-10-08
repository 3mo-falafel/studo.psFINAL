-- Add delivery_method column to orders table
-- This migration adds support for tracking delivery method (Birzeit, Billin, or Home delivery)

-- 1. Add delivery_method column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'delivery_method'
  ) THEN
    ALTER TABLE public.orders 
    ADD COLUMN delivery_method TEXT;
  END IF;
END $$;

-- 2. Add check constraint for valid delivery methods
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_delivery_method_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_delivery_method_check 
CHECK (delivery_method IN ('birzeit', 'billin', 'home'));

-- 3. Add index for faster queries on delivery method
CREATE INDEX IF NOT EXISTS idx_orders_delivery_method 
ON public.orders(delivery_method);

-- 4. Add comment to document the column
COMMENT ON COLUMN public.orders.delivery_method IS 'Delivery method: birzeit (Birzeit University pickup), billin (Billin Village pickup), or home (home delivery)';

-- Verification query
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'orders'
  AND column_name = 'delivery_method';
