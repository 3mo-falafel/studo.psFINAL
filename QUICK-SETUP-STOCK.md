# 🚀 QUICK SETUP - Real-Time Stock Management

## ⚡ What's New?
Your stock system now updates **in real-time** across all browsers! When someone buys a product, the stock quantity updates instantly for everyone viewing the site - no refresh needed!

---

## ✅ Setup Steps (5 Minutes)

### Step 1: Run SQL Script in Supabase 📊
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `UPDATE-STOCK-THRESHOLD.sql`
4. Click **Run**
5. ✅ Verify: You should see stock statistics in the results

### Step 2: Enable Realtime 🔴 IMPORTANT!
1. In Supabase Dashboard → **Database** → **Replication**
2. Find the **`products`** table in the list
3. Toggle **Realtime** to ON (it should turn green)
4. Click **Save Changes**

### Step 3: Restart Your Dev Server 🔄
```powershell
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
# or
pnpm dev
```

---

## 🧪 Test It!

### Test 1: Real-Time Updates (Open 2 Browser Windows)
1. Window 1: Go to a product page
2. Window 2: Go to the same product page
3. Window 1: Add to cart and complete checkout
4. Window 2: **Watch the stock decrease automatically!** ✨

### Test 2: Low Stock Warning
1. Go to Supabase SQL Editor
2. Run: 
   ```sql
   UPDATE products SET stock_quantity = 7 WHERE id = 'any-product-id';
   ```
3. Check your site - you should see **"Only 7 left!"** in orange

### Test 3: Out of Stock
1. Set a product to 0 stock:
   ```sql
   UPDATE products SET stock_quantity = 0 WHERE id = 'any-product-id';
   ```
2. The product should show:
   - 🔴 Red "Out of Stock" badge
   - ❌ Disabled "Add to Cart" button

---

## 📋 What Was Changed?

### ✅ New Files
- `hooks/use-realtime-stock.ts` - Real-time stock subscription hook
- `UPDATE-STOCK-THRESHOLD.sql` - Database update script
- `REALTIME-STOCK-IMPLEMENTATION.md` - Full documentation

### ✅ Updated Files
- `components/home/product-card.tsx` - Now uses real-time stock
- `components/products/product-info.tsx` - Real-time updates
- `lib/types/database.ts` - Added stock_status, trending, best_seller

### ✅ Already Working (No Changes Needed)
- `app/api/orders/route.ts` - Stock decreases on checkout ✅
- Cart validation - Prevents over-ordering ✅
- Stock badges - Show current status ✅

---

## 🎯 Features Now Active

### ✅ Stock Decreases on Checkout
When a customer completes an order, stock automatically goes down:
```
Before Checkout: 25 units
Customer Orders: 2 units
After Checkout: 23 units ← Instant update!
```

### ✅ Low Stock Warning (< 10)
```
Stock = 9 → 🟠 "Only 9 left!"
Stock = 5 → 🟠 "Only 5 left!"
Stock = 1 → 🟠 "Only 1 left!"
```

### ✅ Out of Stock Prevention
```
Stock = 0 → 🔴 "Out of Stock"
           → Button disabled
           → Cannot add to cart
```

### ✅ Real-Time Updates
- No page refresh needed
- Updates across all browsers
- Instant synchronization
- Works on product pages, shop pages, and cards

---

## ❗ Troubleshooting

**Q: Stock not updating in real-time?**
✅ Make sure you enabled **Realtime** for the `products` table in Supabase
✅ Check browser console for any errors
✅ Try refreshing the page once

**Q: Still seeing old stock numbers?**
✅ Run the SQL script: `UPDATE-STOCK-THRESHOLD.sql`
✅ Restart your development server
✅ Clear browser cache (Ctrl+Shift+Delete)

**Q: Button not disabling when out of stock?**
✅ Verify the SQL script ran successfully
✅ Check that stock_quantity = 0 in Supabase
✅ Look at the product page source code (should show disabled="true")

---

## 📊 Database Changes

The SQL script does 3 things:
1. ✅ Updates `update_stock_status()` function (low stock threshold: 5 → 10)
2. ✅ Updates all existing products with correct stock_status
3. ✅ Shows you statistics of your current inventory

---

## 💡 How It Works

```
Customer Completes Order
        ↓
Stock Decreases in Database
        ↓
Database Trigger Updates stock_status
        ↓
Supabase Broadcasts Change (Realtime)
        ↓
All Browsers Receive Update
        ↓
UI Updates Automatically! ✨
```

---

## 🎉 That's It!

Your stock management is now:
- ✅ Real-time (no refresh needed)
- ✅ Automatic (decreases on checkout)
- ✅ Protected (can't go below 0)
- ✅ Smart (low stock warnings at < 10)
- ✅ Safe (prevents overselling)

**Need more details?** Check `REALTIME-STOCK-IMPLEMENTATION.md` for the full documentation!
