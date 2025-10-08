# Create Supabase Storage Bucket for Banner Images

## Steps to Create the Storage Bucket:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `kkulikrjfnvrttamgdxh`
3. **Navigate to Storage** (left sidebar)
4. **Click "Create a new bucket"**
5. **Configure the bucket**:
   - **Name**: `banners`
   - **Public**: ✅ **Enable** (check the box)
   - **File size limit**: 10 MB (10485760 bytes)
   - **Allowed MIME types**: image/png, image/jpeg, image/jpg, image/gif, image/webp
6. **Click "Create bucket"**

## Set Bucket Policies (Important!):

After creating the bucket, you need to set up policies to allow uploads and public access:

### Go to Storage → banners bucket → Policies

**Policy 1: Allow Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banners');
```

**Policy 2: Allow Authenticated Users to Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');
```

**Policy 3: Allow Authenticated Users to Update**
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners');
```

**Policy 4: Allow Authenticated Users to Delete**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners');
```

## Alternative: Quick Setup via SQL

Go to **SQL Editor** in Supabase and run:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up policies
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Authenticated users can update" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can delete" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'banners');
```

## After Setup:

Once the bucket is created with proper policies, you'll be able to:
- ✅ Upload images from your device in the admin panel
- ✅ Images will be publicly accessible on your website
- ✅ Delete and update banner images

The banner upload feature will work automatically after this setup!
