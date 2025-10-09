# ⚡ QUICK FIX - Run This in Supabase SQL Editor

Go to: **Supabase Dashboard → SQL Editor → New Query → Paste & Run:**

```sql
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE discount_codes DROP CONSTRAINT IF EXISTS discount_codes_user_id_fkey;
ALTER TABLE discount_codes ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
```

✅ After running this, checkout will work for guest users!

---

## All Other Issues - FIXED ✅

✅ Double search bar - FIXED  
✅ Cart stock validation - FIXED  
✅ Toast notifications - FIXED  
✅ Green checkmarks - FIXED  

## Only Remaining Issue

⚠️ **Checkout error** - Needs database update (run SQL above)

---

**Server running at: http://localhost:3000**

Test everything after running the SQL script!
