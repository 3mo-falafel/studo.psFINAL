-- ============================================
-- CHECK EXISTING CATEGORIES
-- ============================================
-- Run this first to see what categories exist in your database

SELECT 
  id,
  name,
  slug,
  parent_id,
  is_active
FROM categories
WHERE parent_id IS NULL  -- Only parent categories
ORDER BY name;

-- ============================================
-- This will show you all main categories
-- Find the correct slug for headphones-related category
-- It might be named differently, like:
-- - 'headphones'
-- - 'earphones'
-- - 'audio'
-- - 'sound'
-- etc.
-- ============================================
