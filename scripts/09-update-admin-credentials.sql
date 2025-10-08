-- Ensure admin user exists with correct role
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  'admin'
FROM auth.users
WHERE email = 'jibreel@studo.ps'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', full_name = EXCLUDED.full_name;
