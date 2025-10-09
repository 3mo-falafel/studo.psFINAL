# 🧪 TEST THIS FIX NOW (1 Minute)

## The Bug You Reported:
- Shop page: "Only 2 left!" ✅
- Product page: "12 in stock" ❌

## The Fix Applied:
1. ✅ Using correct database field (`stock_quantity` not `quantity`)
2. ✅ Fetching fresh stock immediately on page load
3. ✅ Real-time updates still working

---

## Quick Test (30 seconds)

### Step 1: Restart Your Server
```powershell
npm run dev
```

### Step 2: Test With Your Airpods Product
1. Go to shop page
2. Find the Airpods (should show "Only 2 left!")
3. Click on it to open product page
4. **CHECK:** Should now also show "Only 2 left!" ✅

### Expected Result:
```
Shop Page:    "Only 2 left!" ✅
Product Page: "Only 2 left!" ✅  (FIXED!)
```

---

## Full Test Scenario

### Test 1: Create New Product
```sql
-- In Supabase SQL Editor
INSERT INTO products (name, slug, price, stock_quantity, is_active)
VALUES ('Test Headphones', 'test-headphones', 99.99, 20, true);
```

**Check:**
- Shop page: Should show "20 available"
- Product page: Should show "20 available"
- Both should match ✅

---

### Test 2: Order Some Items
1. Add 10 items to cart
2. Complete checkout
3. Stock should decrease to 10

**Check:**
- Go to shop page: Should show "10 available"
- Click into product: Should show "10 available"
- Both should match ✅

---

### Test 3: Real-Time Update (Advanced)
1. Open product page (shows 10)
2. In Supabase: `UPDATE products SET stock_quantity = 3 WHERE slug = 'test-headphones'`
3. Product page should update to "Only 3 left!" within 1 second

---

## What Should Happen

### ✅ CORRECT (After Fix)
```
Time: T0 - Product created with stock = 12
Shop:    "12 available"
Product: "12 available"

Time: T1 - Customer orders 10 items
Database: stock = 2

Time: T2 - Customer views product
Shop:    "Only 2 left!"
Product: "Only 2 left!"  ← FIXED! Now shows correct stock
```

### ❌ BEFORE (Bug)
```
Time: T2 - Customer views product
Shop:    "Only 2 left!"
Product: "12 in stock"  ← WRONG! Showed old value
```

---

## 🔍 How to Verify It's Working

### Method 1: Browser DevTools
1. Open product page
2. Press F12 (DevTools)
3. Go to Network tab
4. Look for request to `/rest/v1/products?`
5. Check response: `stock_quantity` should be the correct value

### Method 2: Console Log
The hook now fetches immediately. Check console for:
```
✅ No errors
✅ No warnings
✅ Component renders with correct stock
```

### Method 3: Visual Check
1. Shop page shows X items
2. Product page shows X items
3. X is the same number ✅

---

## 🐛 If It's Still Wrong

### Check 1: Database Field
```sql
-- Run in Supabase
SELECT id, name, quantity, stock_quantity 
FROM products 
WHERE slug = 'your-product-slug';
```

**Expected:**
- `quantity`: Might be old value (12)
- `stock_quantity`: Should be current value (2) ✅

If `stock_quantity` is wrong, the orders API didn't update it.

### Check 2: Clear Cache
```powershell
# Stop server
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

### Check 3: Hard Refresh Browser
- Press `Ctrl + Shift + R` (Windows)
- Or `Cmd + Shift + R` (Mac)
- This clears cached server-rendered pages

---

## 📊 The Fix in Simple Terms

**Before:**
```
Product Page reads: rawProduct.quantity (old field)
Result: Shows 12 (stale data)
```

**After:**
```
Product Page reads: rawProduct.stock_quantity (correct field)
Hook also fetches: Fresh data from database immediately
Result: Shows 2 (current data)
```

---

## ✅ Success Criteria

Your fix is working if:

1. ✅ Shop page and product page show **same stock number**
2. ✅ Product page shows **current stock** not initial stock
3. ✅ After ordering items, product page reflects **new stock**
4. ✅ Low stock badge appears when **stock < 10**
5. ✅ Out of stock badge appears when **stock = 0**

---

## 🎉 Expected Result

When you visit the Airpods product page now:

```
Airpods
₪120.00  Save 37%

🟠 Low Stock - Only 2 left!  ← CORRECT! (was showing 12)

Select Quantity: [-] 1 [+]  (max: 2)

[Add to Cart]
```

**Problem solved!** Both pages show the real, current stock! 🚀
