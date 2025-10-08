# 🎁 Discount Code System - Complete Guide

## Overview
Studo.ps now has an automatic loyalty discount system that rewards customers based on their purchase amount! The system generates single-use discount codes that customers can use on their next order.

---

## 🎯 How It Works

### **Earning Discount Codes**
Customers automatically earn discount codes when they complete an order:

| Purchase Amount | Discount Earned | Code Format |
|----------------|-----------------|-------------|
| ₪250 - ₪499    | **5% OFF**      | STUDO5-XXXXXX |
| ₪500 - ₪999    | **10% OFF**     | STUDO10-XXXXXX |
| ₪1000+         | **15% OFF**     | STUDO15-XXXXXX |

**Important Notes:**
- Discount codes are generated **AFTER** the order is placed
- The calculation is based on the **final order total** (including shipping)
- Each code is **valid for 90 days** from the date of generation
- Codes are **single-use only** - once used, they expire immediately

---

## 💳 Using Discount Codes

### **At Checkout:**
1. Navigate to the checkout page with items in cart
2. Look for the "Enter discount code" field in the Order Summary
3. Type or paste your discount code (e.g., `STUDO10-123456`)
4. Click the **Apply** button
5. The discount will be applied immediately, showing:
   - Green badge with discount percentage
   - Discount amount deducted from subtotal
   - Updated total price
   - Savings message

### **Removing a Discount:**
- Click the **X** button next to the applied discount code
- The discount will be removed and total will update

### **Error Messages:**
- **"Invalid discount code"** - Code doesn't exist or was typed incorrectly
- **"This discount code has already been used"** - Code was used in a previous order
- **"This discount code has expired"** - Code is older than 90 days

---

## 🎉 Success Page Experience

After placing an order that earns a discount code, customers will see:

### **Special Discount Reward Section:**
- 🎉 **Celebration message** with gift icon
- **Discount code displayed prominently** in large text
- **Copy button** to easily copy the code to clipboard
- **Yellow warning box** with important information:
  - Instructions to save the code
  - Single-use only notice
  - 90-day validity period
  - How to use it at checkout
  - **RED warning** that it expires after use

### **Pro Tips Message:**
- Encourages customers to keep shopping for bigger discounts
- Shows the loyalty program benefits

---

## 🗄️ Database Schema

### **discount_codes Table:**
```sql
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,                    -- e.g., STUDO10-123456
  discount_percentage INTEGER NOT NULL,         -- 5, 10, or 15
  min_purchase DECIMAL(10, 2) DEFAULT 0,       -- Minimum purchase (0 for earned codes)
  order_id UUID,                                -- Order that generated this code
  user_id UUID,                                 -- User who earned it (nullable)
  is_used BOOLEAN DEFAULT FALSE,                -- Whether code has been used
  used_at TIMESTAMP,                            -- When it was used
  used_in_order_id UUID,                        -- Order where it was used
  expires_at TIMESTAMP NOT NULL,                -- Expiration date (90 days)
  created_at TIMESTAMP DEFAULT NOW()
)
```

### **orders Table (Updated):**
Added columns:
- `discount_code TEXT` - The code used for this order (if any)
- `discount_amount DECIMAL(10,2)` - Discount amount in ILS

---

## 🔧 Technical Implementation

### **1. Order Creation (`app/api/orders/route.ts`)**
- Accepts `discountCode` and `discountAmount` from checkout
- Stores discount information with the order
- Generates NEW discount code based on order total
- Returns earned discount code to success page

### **2. Discount Validation API (`app/api/discount/route.ts`)**
**POST** - Validate a discount code:
- Checks if code exists
- Verifies not already used
- Confirms not expired
- Returns discount percentage

**PUT** - Mark code as used:
- Updates `is_used` to true
- Records `used_at` timestamp
- Links to order ID where used

### **3. Checkout Summary (`components/checkout/checkout-summary.tsx`)**
- Input field for discount codes
- Real-time validation
- Apply/remove discount functionality
- Visual feedback with green badges
- Savings calculation display

### **4. Checkout Form (`components/checkout/checkout-form.tsx`)**
- Receives applied discount from summary
- Calculates final total with discount
- Sends discount info to order API
- Marks code as used after successful order

### **5. Success Page (`app/checkout/success/page.tsx`)**
- Receives earned discount code from URL params
- Displays celebration section if code earned
- Copy-to-clipboard functionality
- Warning messages and instructions

---

## 📊 Admin View

### **Order Details:**
When viewing an order in admin dashboard, you'll see:
- **Discount Code Used:** Shows which code was applied (if any)
- **Discount Amount:** Amount saved in ILS
- **Adjusted Total:** Final price after discount

### **Generated Codes:**
All generated discount codes are tracked in the `discount_codes` table:
- Which order generated them
- Which user earned them
- Whether they've been used
- When they expire

---

## 🔒 Security & Validation

### **Prevents Abuse:**
1. **Single-use enforcement:** Code validation checks `is_used` flag
2. **Expiration dates:** Automatic 90-day expiry
3. **Atomic updates:** Uses database constraints to prevent double-use
4. **Server-side validation:** All checks happen on backend

### **User-Friendly:**
- Case-insensitive code entry (automatically uppercase)
- Clear error messages
- Visual feedback (green for valid, red for errors)
- Copy-to-clipboard for easy saving

---

## 🚀 Setup Instructions

### **1. Run Database Migrations:**
```bash
# Run in your Supabase SQL editor or via psql
```

Execute these scripts in order:
1. `scripts/18-create-discount-codes-table.sql` - Creates discount_codes table
2. `scripts/19-add-discount-to-orders.sql` - Adds discount fields to orders

### **2. Test the System:**

**Test Earning Codes:**
1. Add products totaling ₪260 to cart
2. Complete checkout
3. Check success page for STUDO5-XXXXXX code

**Test Using Codes:**
1. Copy the earned code
2. Start a new order
3. Enter code at checkout
4. Verify discount applies correctly
5. Complete order
6. Try using same code again (should fail)

---

## 📈 Analytics & Reporting

### **Track Performance:**
```sql
-- Total discount codes generated
SELECT discount_percentage, COUNT(*) 
FROM discount_codes 
GROUP BY discount_percentage;

-- Codes used vs unused
SELECT 
  is_used,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM discount_codes
GROUP BY is_used;

-- Average order value with discounts
SELECT 
  AVG(total) as avg_total,
  AVG(discount_amount) as avg_discount
FROM orders
WHERE discount_code IS NOT NULL;

-- Most popular discount tier
SELECT 
  discount_percentage,
  COUNT(*) as times_used
FROM discount_codes
WHERE is_used = true
GROUP BY discount_percentage
ORDER BY times_used DESC;
```

---

## 🎨 Customization Options

### **Adjust Discount Tiers:**
Edit `app/api/orders/route.ts`:
```typescript
if (total >= 1000) {
  earnedDiscountPercentage = 15  // Change percentage
} else if (total >= 500) {        // Change threshold
  earnedDiscountPercentage = 10
} else if (total >= 250) {
  earnedDiscountPercentage = 5
}
```

### **Change Expiration Period:**
Edit `app/api/orders/route.ts`:
```typescript
const expiresAt = new Date()
expiresAt.setDate(expiresAt.getDate() + 90)  // Change from 90 days
```

### **Modify Code Format:**
Edit `app/api/orders/route.ts`:
```typescript
earnedDiscountCode = `STUDO${earnedDiscountPercentage}-${codeRandomDigits}`
// Change prefix or format as desired
```

---

## 🐛 Troubleshooting

### **Code Not Generated:**
- Check order total meets minimum (₪250+)
- Review server logs for errors
- Verify discount_codes table exists

### **Code Not Applying:**
- Verify code is correct (case-insensitive)
- Check expiration date
- Confirm not already used
- Check network requests in browser console

### **Discount Not Calculating:**
- Ensure CheckoutSummary receives deliveryMethod prop
- Verify discount validation API is responding
- Check cart total is correct

---

## 🎯 Best Practices

### **For Customers:**
1. **Save codes immediately** - Screenshot or write down
2. **Use within 90 days** - Codes expire
3. **Plan purchases** - Combine items to reach higher discount tiers
4. **One code per order** - Can't stack multiple codes

### **For Store Owners:**
1. **Monitor code usage** - Track redemption rates
2. **Analyze purchase patterns** - See which tiers are most popular
3. **Promote the system** - Tell customers about the rewards
4. **Clean expired codes** - Periodically remove old unused codes

---

## 🔄 Future Enhancements

Potential features to add:
- [ ] Special occasion codes (birthdays, holidays)
- [ ] Category-specific discounts
- [ ] Referral codes
- [ ] Minimum purchase requirements for certain codes
- [ ] Code sharing prevention
- [ ] Email notifications with codes
- [ ] Code history in user account

---

## 📞 Support

For issues or questions:
- **WhatsApp:** +972 59-976-5211
- **Email:** jibreel@studo.ps

---

**Made with ❤️ by Studo.ps**
*Last Updated: January 2025*
