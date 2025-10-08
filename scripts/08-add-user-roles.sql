-- Add role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Update the admin user to have admin role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'jibreel@studo.ps';
