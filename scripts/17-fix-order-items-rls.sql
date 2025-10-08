-- Fix RLS policies for order_items table
-- This allows creating order items when placing orders

-- 1. Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can create order items" ON public.order_items;

-- 2. Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow viewing order items
-- Users can view their own order items, admins can view all
CREATE POLICY "Users can view their order items"
  ON public.order_items FOR SELECT
  USING (
    -- Admins can see all
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    -- Users can see their own orders' items
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- 4. Create policy to allow creating order items
-- Allow authenticated users and unauthenticated users to create order items
CREATE POLICY "Allow creating order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- 5. Create policy for admins to update order items
CREATE POLICY "Admins can update order items"
  ON public.order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Create policy for admins to delete order items
CREATE POLICY "Admins can delete order items"
  ON public.order_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verification query
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'order_items';
