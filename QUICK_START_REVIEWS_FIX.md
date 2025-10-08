# 🎯 QUICK START - Reviews Fix

## Run This SQL Script First:

**In Supabase Dashboard → SQL Editor**, copy and run `scripts/12-fix-reviews-rls.sql`

This fixes the RLS policies so admins can see ALL reviews (not just approved ones).

---

## Then Copy This Code:

**Save as `app/admin/reviews/page.tsx`** (delete the old file first if needed)

The complete code is in **COMPLETE_REVIEWS_FIX_GUIDE.md** - STEP 3.

---

## Files I Created For You:

✅ `scripts/12-fix-reviews-rls.sql` - SQL to fix RLS policies
✅ `app/api/admin/reviews/route.ts` - Fixed API
✅ `app/api/admin/testimonials/route.ts` - NEW API
✅ `app/api/admin/testimonials/[testimonialId]/approve/route.ts` - NEW
✅ `app/api/admin/testimonials/[testimonialId]/route.ts` - NEW  
✅ `app/admin/reviews/layout.tsx` - Admin layout
⚠️ `app/admin/reviews/page.tsx` - **YOU NEED TO CREATE THIS** (see guide)

---

## What Changed:

### 1. Admin Dashboard Now Has:
- **Two Tabs**: Product Reviews | Site Testimonials
- **Stats Cards**: Shows counts of pending/approved for each type
- **Better Layout**: Orange cards for pending, green badges for approved
- **Approve/Reject Buttons**: One-click approval

### 2. Footer Testimonials Now:
- 4-column grid (desktop)
- Gradient backgrounds
- Hover effects
- More prominent display

---

## To Test:

1. **Run SQL script** in Supabase
2. **Copy admin page code** from guide into `app/admin/reviews/page.tsx`
3. **Restart dev server**: `npm run dev`
4. **Visit**: `http://localhost:3001/admin/reviews`
5. **Submit test reviews** on product pages and footer
6. **Approve them** in admin dashboard
7. **See them appear** on site

---

## Need Help?

Read **COMPLETE_REVIEWS_FIX_GUIDE.md** for:
- Complete SQL script
- Complete page code
- Troubleshooting steps
- What you should see

---

## The Main Problem Was:

❌ **RLS Policy Too Restrictive**: Only approved reviews were visible
✅ **Fixed**: Admins can now see ALL reviews, public sees only approved

The policy now says:
```sql
is_approved = true OR (user is admin)
```

This lets admins manage pending reviews while keeping approved ones public.
