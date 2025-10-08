# 🔧 FIX: Category Images Upload Error

## ❌ **ERROR**
```
Error uploading image: new row violates row-level security policy
```

## ✅ **SOLUTION**

This error occurs because the Row Level Security (RLS) policies for the `category_images` table aren't properly configured. Follow these steps to fix it:

### **Step 1: Run the Fix SQL Script**

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire contents of: `scripts/14-fix-category-images-rls.sql`
4. Paste and click **Run**

This script will:
- ✅ Drop and recreate all RLS policies with correct admin checks
- ✅ Ensure the `is_admin()` function exists
- ✅ Create/update the `category-images` storage bucket
- ✅ Set up proper storage policies for authenticated uploads
- ✅ Confirm admin user role for `jibreel@studo.ps`
- ✅ Grant necessary permissions

### **Step 2: Verify Admin User**

After running the script, check the output at the bottom:
```sql
-- You should see:
email            | role  | has_admin_access
jibreel@studo.ps | admin | true
```

If `has_admin_access` is `false` or the user doesn't exist:
1. Make sure you're logged in as `jibreel@studo.ps`
2. Check the `users` table has a record with `role = 'admin'`

### **Step 3: Clear Browser Cache & Retry**

1. **Logout** from the admin dashboard
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Login again** as `jibreel@studo.ps` / `12345`
4. Go to **Admin Dashboard → Category Images**
5. Try uploading an image again

### **Step 4: Test Upload**

Upload a test image to any category slot:
1. Click "Choose File"
2. Select an image (max 10MB)
3. Add title and description
4. Click "Upload Image"

If successful, you'll see:
```
✓ Category image added successfully
```

## 🔍 **WHAT CAUSED THIS?**

The issue happened because:
1. The `category_images` table was created with RLS enabled
2. The policies referenced `is_admin()` function
3. But the function wasn't properly checking the current user's role
4. Or the storage bucket policies weren't set up correctly

## 📝 **WHAT THE FIX DOES**

The new script (`14-fix-category-images-rls.sql`) ensures:

### **1. Table Policies** (for `category_images` table)
```sql
✓ SELECT: Anyone can view (public access)
✓ INSERT: Only admins (checks users.role = 'admin')
✓ UPDATE: Only admins
✓ DELETE: Only admins
```

### **2. Storage Policies** (for `category-images` bucket)
```sql
✓ SELECT: Anyone can view uploaded images
✓ INSERT: Authenticated users can upload
✓ UPDATE: Only admins can modify files
✓ DELETE: Only admins can delete files
```

### **3. Helper Function**
```sql
✓ is_admin(): Returns true if current user has role='admin'
✓ Uses SECURITY DEFINER for proper permission checks
✓ Queries the users table for the authenticated user
```

## ⚠️ **COMMON ISSUES & FIXES**

### Issue: "Function is_admin() does not exist"
**Fix:** Run script `12-fix-admin-rls-policies.sql` first, then run `14-fix-category-images-rls.sql`

### Issue: "Bucket does not exist"
**Fix:** The script creates it automatically. If still failing, manually create bucket named `category-images` in Supabase Storage

### Issue: "Still getting RLS error after running script"
**Fix:** 
1. Check you're logged in as the correct admin user
2. Run this query in SQL Editor to verify:
```sql
SELECT auth.uid(), role FROM users WHERE id = auth.uid();
```
3. Make sure it returns `role = 'admin'`

### Issue: "Image uploads but doesn't appear on homepage"
**Fix:** Make sure the image is marked as "Active" (checkbox checked) in the admin interface

## 🎯 **VERIFICATION CHECKLIST**

After running the fix script, verify:

- [ ] SQL script runs without errors
- [ ] Admin user shows `has_admin_access = true`
- [ ] Storage bucket `category-images` exists
- [ ] Can upload image from admin dashboard
- [ ] Image appears in the admin list
- [ ] Image URL is accessible (Supabase Storage URL)
- [ ] Image rotates on homepage when active

## 📁 **FILES INVOLVED**

- `scripts/14-fix-category-images-rls.sql` - **RUN THIS to fix the error**
- `scripts/13-create-category-images.sql` - Original table creation
- `scripts/12-fix-admin-rls-policies.sql` - General admin RLS fix
- `components/admin/category-images-manager.tsx` - Upload interface

## 🆘 **STILL NOT WORKING?**

If you're still getting errors after following all steps:

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs → Database
   - Look for RLS policy violation errors
   - Note the specific policy name that's failing

2. **Verify User Role:**
   ```sql
   SELECT * FROM users WHERE email = 'jibreel@studo.ps';
   ```
   Should show `role = 'admin'`

3. **Check Auth Status:**
   ```sql
   SELECT auth.uid(); -- Should return a UUID
   SELECT auth.role(); -- Should return 'authenticated'
   ```

4. **Manual Policy Creation:**
   If the automated script fails, you can manually create policies in Supabase Dashboard:
   - Go to Database → Tables → category_images
   - Click "RLS disabled" to enable it
   - Add policies manually using the SQL from the fix script

## ✅ **SUCCESS!**

Once fixed, you should be able to:
- ✅ Upload images from admin dashboard
- ✅ Edit image titles/descriptions
- ✅ Reorder images with display_order
- ✅ Toggle active/inactive status
- ✅ Delete images
- ✅ See images rotating on homepage

**The error is now fixed! Try uploading again.** 🎉
