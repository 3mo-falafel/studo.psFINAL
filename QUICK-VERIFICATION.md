# ✅ QUICK VERIFICATION - Stock System Working Correctly

## 🎯 Quick Tests (2 Minutes Each)

### Test 1: Product Page Real-Time Stock ⚡
**Steps:**
1. Open any product page
2. Note the current stock number
3. Open Supabase SQL Editor
4. Run: `UPDATE products SET stock_quantity = 5 WHERE slug = 'product-slug';`
5. **Watch the product page** (don't refresh!)

**✅ Expected Result:**
- Stock badge changes to "Only 5 left!" in orange
- Happens within 1-2 seconds
- No page refresh needed
- Quantity selector max becomes 5

---

### Test 2: Out-of-Stock Prevention 🚫
**Steps:**
1. Set a product to 0 stock in Supabase:
   ```sql
   UPDATE products SET stock_quantity = 0 WHERE slug = 'product-slug';
   ```
2. Go to that product page
3. Try to click "Add to Cart"

**✅ Expected Result:**
- Red alert box appears: "Out of Stock"
- "Add to Cart" button is hidden
- Quantity selector is hidden
- Red badge shows "Out of Stock"
- Console shows: "Cannot add X to cart: Out of stock"

---

### Test 3: Cart Real-Time Updates 🛒
**Steps:**
1. Add a product to cart (quantity: 3)
2. In Supabase, reduce that product's stock:
   ```sql
   UPDATE products SET stock_quantity = 2 WHERE id = 'product-id';
   ```
3. Look at your cart page (don't refresh!)

**✅ Expected Result:**
- Orange alert appears: "Only 2 left in stock!"
- Quantity auto-adjusts from 3 to 2
- Toast notification appears
- Plus button becomes disabled
- Badge shows "2 left"

---

### Test 4: Cart Item Out of Stock 💥
**Steps:**
1. Have an item in cart
2. Set its stock to 0:
   ```sql
   UPDATE products SET stock_quantity = 0 WHERE id = 'product-id';
   ```
3. Check cart page

**✅ Expected Result:**
- Red border around cart item
- Red alert: "Out of Stock - Item will be removed"
- Red badge: "Out of stock"
- All quantity buttons disabled
- Toast: "X is now out of stock and has been removed"
- Item disappears from cart

---

## 🔍 Visual Checklist

### On Product Cards (Shop Page)
- [ ] Green badge: "52 available" when stock ≥ 10
- [ ] Orange badge: "Only 7 left!" when stock < 10
- [ ] Red badge: "Out of Stock" when stock = 0
- [ ] Button disabled when stock = 0
- [ ] Button text changes to "Out of Stock"

### On Product Detail Page
- [ ] Real-time stock badge (green/orange/red)
- [ ] Red alert box when out of stock
- [ ] Quantity selector disappears when stock = 0
- [ ] "Add to Cart" button hidden when stock = 0
- [ ] Quantity max equals current stock
- [ ] "Only X left!" message when stock < 10

### In Shopping Cart
- [ ] Orange warning for low stock items
- [ ] Red warning for out-of-stock items
- [ ] Stock badge on each item ("3 left")
- [ ] Plus button disabled at stock limit
- [ ] Minus/Plus disabled when out of stock
- [ ] Item auto-removed when stock = 0

---

## 🐛 Troubleshooting

### Issue: Stock not updating in real-time
**Check:**
1. Is Realtime enabled in Supabase? (Database → Replication → products table)
2. Browser console shows connection? (Look for "SUBSCRIBED" status)
3. Try refreshing the page once

**Fix:**
```powershell
# Restart dev server
npm run dev
```

### Issue: Can still add out-of-stock items
**Check:**
1. Browser console - should show warning log
2. Redux DevTools - cart state should not change
3. Clear browser cache (Ctrl+Shift+Delete)

**Verify in Code:**
- Check `lib/redux/slices/cart-slice.ts` line ~45
- Should have: `if (action.payload.stock <= 0) return`

### Issue: Cart not showing warnings
**Check:**
1. `components/cart/cart-items.tsx` has `useRealtimeStock` import
2. `updateCartItemStock` is dispatched in useEffect
3. Browser console for any errors

**Fix:**
```powershell
# Clear node modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## 📱 Mobile Testing

Same tests work on mobile:
1. Open site on phone
2. Make stock changes in Supabase on computer
3. Watch phone update in real-time
4. Test adding out-of-stock items
5. Check cart warnings appear correctly

---

## 🎯 Success Criteria

Your stock system is working correctly if:

✅ **Product pages** show current stock without refresh
✅ **Out-of-stock items** cannot be added to cart
✅ **Cart items** show stock warnings in real-time
✅ **Quantity buttons** disable at stock limits
✅ **Toast notifications** appear when stock changes
✅ **Visual badges** update automatically (green/orange/red)
✅ **Multiple users** see synchronized stock levels
✅ **Console logs** show no errors

---

## 🔑 Quick SQL Commands

### Check Stock Status
```sql
SELECT id, name, stock_quantity, stock_status 
FROM products 
ORDER BY stock_quantity ASC 
LIMIT 10;
```

### Set Product to Low Stock (for testing)
```sql
UPDATE products 
SET stock_quantity = 5 
WHERE slug = 'your-product-slug';
```

### Set Product to Out of Stock (for testing)
```sql
UPDATE products 
SET stock_quantity = 0 
WHERE slug = 'your-product-slug';
```

### Restore Stock (after testing)
```sql
UPDATE products 
SET stock_quantity = 25 
WHERE slug = 'your-product-slug';
```

### Check Realtime Status
```sql
-- In Supabase Dashboard → Database → Replication
-- Find "products" table
-- Toggle should be GREEN (enabled)
```

---

## ✨ Everything Working?

If all tests pass:
1. ✅ Your stock system is **production-ready**
2. ✅ Customers cannot order unavailable items
3. ✅ Real-time updates prevent conflicts
4. ✅ Professional user experience delivered

**You're all set! 🎉**

---

## 📞 Need Help?

If any test fails:
1. Check the error in browser console (F12)
2. Verify Supabase Realtime is enabled
3. Confirm SQL script was run successfully
4. Restart development server
5. Clear browser cache and test again

**Most issues are solved by:**
- ✅ Enabling Realtime in Supabase
- ✅ Restarting the dev server
- ✅ Clearing browser cache
