-- Create admin user with credentials
-- Email: admin@studo.ps
-- Password: StudoAdmin2024!

-- Insert admin user into auth.users (this will be handled by Supabase Auth)
-- For now, we'll create a profile entry that will be linked when you sign up

-- First, you need to sign up with email: admin@studo.ps and password: StudoAdmin2024!
-- Then run this script to make that user an admin:

-- Update the user role to admin (replace the email with your admin email if different)
UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@studo.ps';

-- If the profile doesn't exist yet, you can create it manually:
-- INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
-- VALUES (
--   'YOUR_USER_ID_FROM_AUTH',  -- You'll get this after signing up
--   'admin@studo.ps',
--   'Admin User',
--   'admin',
--   NOW(),
--   NOW()
-- );
