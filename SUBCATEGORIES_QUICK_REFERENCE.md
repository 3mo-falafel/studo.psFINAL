# Subcategory System - Quick Reference Guide

## 📋 Overview
Your e-commerce now has subcategory filtering for **two categories**:
1. **iPad Accessories** (4 subcategories)
2. **Computer Accessories** (5 subcategories)

---

## 🎯 Quick Setup Steps

### For Computer Accessories (NEW)

#### 1️⃣ Run SQL Migration
```bash
# Open Supabase SQL Editor
# Paste content from: ADD-COMPUTER-SUBCATEGORIES.sql
# Execute
```

#### 2️⃣ Verify Subcategories Created
```sql
SELECT name, slug, display_order 
FROM categories 
WHERE parent_id = (SELECT id FROM categories WHERE slug = 'computer-accessories')
ORDER BY display_order;
```

Expected output:
```
Mice          | mice            | 1
Keyboards     | keyboards       | 2
Speakers      | speakers        | 3
Mouse Pads    | mouse-pads      | 4
Stands        | computer-stands | 5
```

#### 3️⃣ Assign Products to Subcategories

**Quick Assignment Examples:**
```sql
-- Mice
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'mice')
WHERE name ILIKE '%mouse%' 
  AND name NOT ILIKE '%pad%'
  AND category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');

-- Keyboards
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'keyboards')
WHERE name ILIKE '%keyboard%'
  AND category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');

-- Speakers
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'speakers')
WHERE name ILIKE '%speaker%'
  AND category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');

-- Mouse Pads
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'mouse-pads')
WHERE name ILIKE '%pad%'
  AND category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');

-- Stands
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'computer-stands')
WHERE name ILIKE '%stand%' OR name ILIKE '%riser%'
  AND category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');
```

#### 4️⃣ Test It
```bash
# Start dev server
pnpm dev

# Visit: http://localhost:3000/categories/computer-accessories
# You should see the subcategory filter at the top
```

---

## 📊 Current Subcategories Setup

### iPad Accessories
| Subcategory    | Slug           | Image                                       | Status       |
|----------------|----------------|---------------------------------------------|--------------|
| Pencils        | pencils        | Amazon iPad Pencil image                    | ✅ Active    |
| Keyboards/Mice | keyboards-mice | iPad keyboard image                         | ✅ Active    |
| Stands         | stands         | iPad stand image                            | ✅ Active    |
| Cases          | cases          | iPad case image                             | 🔜 Coming Soon |

### Computer Accessories (NEW)
| Subcategory | Slug            | Image                                       | Status    |
|-------------|-----------------|---------------------------------------------|-----------|
| Mice        | mice            | JB Hi-Fi mouse image                        | ✅ Active |
| Keyboards   | keyboards       | HAVIT mechanical keyboard                   | ✅ Active |
| Speakers    | speakers        | Computer speakers                           | ✅ Active |
| Mouse Pads  | mouse-pads      | Gaming mouse pad                            | ✅ Active |
| Stands      | computer-stands | Poppin laptop riser                         | ✅ Active |

---

## 🔧 How to Add More Subcategories (Any Category)

### Step 1: Add Translation
Edit `lib/contexts/language-context.tsx`:
```typescript
// In Arabic section (around line 230)
"your-subcategory-slug": "الترجمة العربية",

// No need to add English - it uses the database name
```

### Step 2: Create Database Entry
```sql
INSERT INTO categories (
  id,
  name,
  slug,
  description,
  image_url,
  parent_id,
  is_active,
  display_order,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Your Subcategory Name',
  'your-subcategory-slug',
  'Description here',
  'https://your-image-url.com/image.jpg',
  (SELECT id FROM categories WHERE slug = 'parent-category-slug'),
  true,
  6, -- Next order number
  NOW(),
  NOW()
);
```

### Step 3: Enable Filter in Page
Edit `app/categories/[slug]/page.tsx`:
```typescript
showSubcategoryFilter={
  category.slug === "ipad-accessories" || 
  category.slug === "computer-accessories" ||
  category.slug === "your-new-category-slug" // Add this
}
```

### Step 4: Assign Products
```sql
UPDATE products 
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'your-subcategory-slug')
WHERE id = 'product-uuid';
```

---

## 🎨 Customization Options

### Mark Subcategory as "Coming Soon"
Edit `app/categories/[slug]/page.tsx`:
```typescript
const subcategoriesWithFlags = (subcategories || []).map((sub) => ({
  id: sub.id,
  name: sub.name,
  slug: sub.slug,
  image_url: sub.image_url || "",
  isComingSoon: sub.slug === "your-slug", // Add your slug here
}))
```

### Change Subcategory Order
```sql
UPDATE categories
SET display_order = 1
WHERE slug = 'your-subcategory-slug';
```

### Update Subcategory Image
```sql
UPDATE categories
SET image_url = 'https://new-image-url.com/image.jpg'
WHERE slug = 'your-subcategory-slug';
```

---

## 🌍 Arabic Translations Reference

### iPad Accessories
- `pencils` → "أقلام iPad"
- `keyboards-mice` → "ماوسات و كيبوردات"
- `stands` → "ستاندات"
- `cases` → "كفرات (قريباً)"

### Computer Accessories
- `mice` → "ماوسات"
- `keyboards` → "كيبوردات"
- `speakers` → "سماعات"
- `mouse-pads` → "ماوس بادات"
- `computer-stands` → "ستاندات كمبيوتر"

### Shared Translations
- `filterBySubcategory` → "تصفية حسب الفئة الفرعية"
- `comingSoon` → "قريباً"

---

## 🐛 Common Issues & Solutions

### Issue: Subcategory filter not showing
**Solution:** Check that the category slug is added to `showSubcategoryFilter` condition in `app/categories/[slug]/page.tsx`

### Issue: Products not filtering
**Solution:** Ensure products have `subcategory_id` set:
```sql
SELECT name, subcategory_id 
FROM products 
WHERE category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories');
```

### Issue: Translation not appearing
**Solution:** 
1. Verify translation added in `language-context.tsx`
2. Restart dev server: `pnpm dev`
3. Clear browser cache

### Issue: Image not loading
**Solution:**
1. Check image URL is accessible
2. Verify HTTPS (not HTTP)
3. Check for CORS issues
4. Update URL in database:
```sql
UPDATE categories 
SET image_url = 'https://new-url.com/image.jpg'
WHERE slug = 'your-slug';
```

---

## 📈 Product Assignment Queries

### Check Current Assignments
```sql
-- See how many products in each subcategory
SELECT 
  c.name as subcategory,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON p.subcategory_id = c.id
WHERE c.parent_id IS NOT NULL
GROUP BY c.name, c.display_order
ORDER BY c.display_order;
```

### Find Unassigned Products
```sql
-- Products in category but no subcategory
SELECT name, slug
FROM products
WHERE category_id = (SELECT id FROM categories WHERE slug = 'computer-accessories')
  AND subcategory_id IS NULL;
```

### Bulk Assignment Template
```sql
-- Assign multiple products at once
UPDATE products
SET subcategory_id = (SELECT id FROM categories WHERE slug = 'mice')
WHERE id IN (
  'product-uuid-1',
  'product-uuid-2',
  'product-uuid-3'
);
```

---

## 🚀 Performance Tips

### 1. Use Indexes
Ensure these indexes exist:
```sql
CREATE INDEX IF NOT EXISTS idx_products_subcategory 
ON products(subcategory_id);

CREATE INDEX IF NOT EXISTS idx_categories_parent 
ON categories(parent_id);
```

### 2. Optimize Image Loading
- Use compressed images (WebP format)
- Recommended size: 800x800px
- File size: <200KB per image

### 3. Cache Considerations
The filtering is **100% client-side**, so:
- ✅ No API calls when filtering
- ✅ Instant response
- ✅ Works offline once page loaded
- ✅ `useMemo` prevents unnecessary recalculations

---

## 📝 Maintenance Checklist

### Monthly
- [ ] Review product-subcategory assignments
- [ ] Check for unassigned products
- [ ] Verify all images loading correctly
- [ ] Test filtering in both languages

### When Adding New Products
- [ ] Assign to appropriate subcategory
- [ ] Test filtering includes new product
- [ ] Verify product appears in correct subcategory

### When Adding New Subcategories
- [ ] Add Arabic translation
- [ ] Update category page logic (if new parent category)
- [ ] Create database entry
- [ ] Assign initial products
- [ ] Test filtering system

---

## 🎯 Quick Commands Reference

### Development
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database
```bash
# Open Supabase dashboard
# Navigate to: SQL Editor

# Common queries location
# - ADD-IPAD-SUBCATEGORIES.sql
# - ADD-COMPUTER-SUBCATEGORIES.sql
```

### Testing URLs
```bash
# iPad Accessories with filter
http://localhost:3000/categories/ipad-accessories

# Computer Accessories with filter
http://localhost:3000/categories/computer-accessories

# Other categories (no filter)
http://localhost:3000/categories/any-other-category
```

---

## ✅ Status Summary

| Feature                        | iPad Acc. | Computer Acc. | Status |
|--------------------------------|-----------|---------------|--------|
| Subcategories Created          | ✅        | ✅            | Done   |
| Arabic Translations            | ✅        | ✅            | Done   |
| Filter UI Component            | ✅        | ✅            | Done   |
| Client-Side Filtering Logic    | ✅        | ✅            | Done   |
| Database Migration Script      | ✅        | ✅            | Done   |
| Product Assignment Examples    | ✅        | ✅            | Done   |
| Documentation                  | ✅        | ✅            | Done   |
| Ready to Use                   | ✅        | ✅            | Done   |

---

*Last Updated: 2025-10-13*
*System Version: 2.0 (Two Categories with Subcategories)*
