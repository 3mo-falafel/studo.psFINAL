-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Banners policies (public read, admin write)
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

-- Addresses policies
CREATE POLICY "Users can view their own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Wishlists policies
CREATE POLICY "Users can view their own wishlist" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Blog posts policies (public read published posts)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
