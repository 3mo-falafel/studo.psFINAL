-- Create RPC function to insert testimonials bypassing RLS
CREATE OR REPLACE FUNCTION insert_testimonial(
  customer_name_param TEXT,
  rating_param INTEGER,
  comment_param TEXT
) RETURNS TABLE (
  id UUID,
  customer_name TEXT,
  rating INTEGER,
  comment TEXT,
  is_approved BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function owner
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO site_testimonials (customer_name, rating, comment, is_approved)
  VALUES (customer_name_param, rating_param, comment_param, false)
  RETURNING 
    site_testimonials.id,
    site_testimonials.customer_name,
    site_testimonials.rating,
    site_testimonials.comment,
    site_testimonials.is_approved,
    site_testimonials.created_at,
    site_testimonials.updated_at;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION insert_testimonial(TEXT, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION insert_testimonial(TEXT, INTEGER, TEXT) TO authenticated;