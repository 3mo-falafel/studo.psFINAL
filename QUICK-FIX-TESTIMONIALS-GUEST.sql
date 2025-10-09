-- QUICK FIX: Let EVERYONE submit site testimonials (guest or signed-in)
-- Run this in Supabase SQL Editor

BEGIN;

-- 1) Clean up any existing policies on site_testimonials (avoids name conflicts)
DO $$
DECLARE p text;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_testimonials' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_testimonials', p);
  END LOOP;
END $$;

-- 2) Ensure RLS is enabled (required by Supabase)
ALTER TABLE public.site_testimonials ENABLE ROW LEVEL SECURITY;

-- 3) Allow ANYONE (public) to INSERT testimonials
CREATE POLICY "public_can_insert_testimonials"
  ON public.site_testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 4) Let EVERYONE read only approved testimonials
CREATE POLICY "public_can_read_approved_testimonials"
  ON public.site_testimonials
  FOR SELECT
  TO public
  USING (is_approved = true);

-- 5) Allow authenticated users (e.g. admin UI) to update/delete rows
CREATE POLICY "auth_can_update_testimonials"
  ON public.site_testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "auth_can_delete_testimonials"
  ON public.site_testimonials
  FOR DELETE
  TO authenticated
  USING (true);

COMMIT;

-- Optional: if your id column uses a sequence, grant usage to anon/auth
DO $$
DECLARE seq text := pg_get_serial_sequence('public.site_testimonials', 'id');
BEGIN
  IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO anon', seq);
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated', seq);
  END IF;
END $$;

-- Verify policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'site_testimonials'
ORDER BY cmd, policyname;