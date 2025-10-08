# 🏗️ STUDO E-COMMERCE - COMPLETE ARCHITECTURE

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CUSTOMER FRONTEND                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │   Header     │  │  Product     │  │  Wishlist    │  │   Cart      ││
│  │              │  │  Pages       │  │  Page        │  │   Page      ││
│  │ • Search Bar │  │ • Gallery    │  │ • Move Cart  │  │ • Summary   ││
│  │ • Language   │  │ • Reviews    │  │ • Share      │  │ • Checkout  ││
│  │ • Cart Icon  │  │ • Social     │  │ • Enhanced   │  │             ││
│  │ • Mobile     │  │   Proof      │  │   Toasts     │  │             ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │   Shop       │  │  Categories  │  │  Account     │  │   Footer    ││
│  │              │  │  Grid        │  │  Dashboard   │  │             ││
│  │ • Filters    │  │ • Browse All │  │ • Orders     │  │ • Links     ││
│  │ • Sort       │  │ • Images     │  │ • Addresses  │  │ • Social    ││
│  │ • Pagination │  │              │  │ • Profile    │  │ • Contact   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEXT.JS API ROUTES                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  /api/search       │  │  /api/reviews      │  │  /api/analytics    ││
│  │                    │  │                    │  │                    ││
│  │  GET - Search      │  │  POST - Submit     │  │  POST - Track View ││
│  │  • Products        │  │  • Customer review │  │  • increment_view()││
│  │  • Categories      │  │  • is_approved:    │  │                    ││
│  │  • Debounced       │  │    false default   │  │  GET - Fetch Stats ││
│  │  • 10 results      │  │                    │  │  • views_count     ││
│  │                    │  │  GET - List        │  │  • sales_count     ││
│  │                    │  │  • Approved only   │  │  • views_today     ││
│  │                    │  │  • By productId    │  │  • sales_today     ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  /api/admin/       │  │  /api/orders       │  │  /api/shop         ││
│  │  reviews           │  │                    │  │                    ││
│  │                    │  │  POST - Create     │  │  GET - List        ││
│  │  GET - All reviews │  │  • Payment         │  │  • Filter          ││
│  │  PUT - Approve     │  │  • increment_      │  │  • Sort            ││
│  │  DELETE - Reject   │  │    sales()         │  │  • Paginate        ││
│  │                    │  │                    │  │  • Best sellers    ││
│  │                    │  │  GET - User orders │  │  • Trending        ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  products          │  │  product_reviews   │  │  product_analytics ││
│  │                    │  │                    │  │                    ││
│  │  • id              │  │  • id              │  │  • product_id (PK) ││
│  │  • name            │  │  • product_id (FK) │  │  • views_count     ││
│  │  • slug            │  │  • customer_name   │  │  • views_today     ││
│  │  • description     │  │  • rating (1-5)    │  │  • sales_count     ││
│  │  • price           │  │  • comment         │  │  • sales_today     ││
│  │  • images[]        │  │  • is_approved ✓   │  │  • last_view_at    ││
│  │  • quantity        │  │  • created_at      │  │  • last_sale_at    ││
│  │  • category_id     │  │                    │  │  • created_at      ││
│  │  • best_seller ✓   │  │  RLS:              │  │  • updated_at      ││
│  │  • trending ✓      │  │  • Anyone submit   │  │                    ││
│  │                    │  │  • Approved only   │  │  Auto-updated by:  ││
│  │                    │  │    visible         │  │  • increment_view()││
│  │                    │  │                    │  │  • increment_sales()││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  wishlist_shares   │  │  orders            │  │  categories        ││
│  │                    │  │                    │  │                    ││
│  │  • id              │  │  • id              │  │  • id              ││
│  │  • share_code      │  │  • user_id         │  │  • name            ││
│  │  • user_id         │  │  • items[]         │  │  • slug            ││
│  │  • product_ids[]   │  │  • total           │  │  • description     ││
│  │  • expires_at      │  │  • status          │  │  • image           ││
│  │  • created_at      │  │  • created_at      │  │  • display_order   ││
│  │                    │  │                    │  │                    ││
│  │  Expires: 30 days  │  │  Triggers:         │  │                    ││
│  │                    │  │  • increment_      │  │                    ││
│  │                    │  │    sales()         │  │                    ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      SQL FUNCTIONS (RPC)                           │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │  1. increment_product_view(p_product_id UUID)                     │ │
│  │     • ON CONFLICT (product_id) DO UPDATE                          │ │
│  │     • views_count = views_count + 1                               │ │
│  │     • views_today = views_today + 1                               │ │
│  │     • last_view_at = NOW()                                        │ │
│  │     ✅ Atomic operation (race condition safe)                     │ │
│  │                                                                    │ │
│  │  2. increment_product_sales(p_product_id UUID, p_quantity INT)    │ │
│  │     • sales_count = sales_count + quantity                        │ │
│  │     • sales_today = sales_today + quantity                        │ │
│  │     • last_sale_at = NOW()                                        │ │
│  │     ✅ Called after successful order                              │ │
│  │                                                                    │ │
│  │  3. update_best_sellers()                                         │ │
│  │     • Find top 20% by sales_count                                 │ │
│  │     • SET best_seller = true for top performers                   │ │
│  │     • SET best_seller = false for others                          │ │
│  │     ⏰ Run weekly via cron job                                     │ │
│  │                                                                    │ │
│  │  4. update_trending_products()                                    │ │
│  │     • High views_count (> 100)                                    │ │
│  │     • Recent sales (last 7 days)                                  │ │
│  │     • SET trending = true/false                                   │ │
│  │     ⏰ Run daily via cron job                                      │ │
│  │                                                                    │ │
│  │  5. reset_daily_counters()                                        │ │
│  │     • SET views_today = 0                                         │ │
│  │     • SET sales_today = 0                                         │ │
│  │     ⏰ Run at midnight daily                                       │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Admin Access
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          ADMIN DASHBOARD                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │  Products    │  │  Categories  │  │  Banners     │  │   Orders    ││
│  │              │  │              │  │              │  │             ││
│  │ • Add/Edit   │  │ • Add/Edit   │  │ • Add/Edit   │  │ • View All  ││
│  │ • Stock      │  │ • Images     │  │ • Hero       │  │ • Status    ││
│  │ • Pricing    │  │ • Order      │  │ • Promo      │  │ • Details   ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘│
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐                                    │
│  │  Reviews ⭐   │  │  Users       │                                    │
│  │              │  │              │                                    │
│  │ • Pending (5)│  │ • View All   │                                    │
│  │ • Approve ✅ │  │ • Roles      │                                    │
│  │ • Reject ❌  │  │ • Activity   │                                    │
│  └──────────────┘  └──────────────┘                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                        REUSABLE COMPONENTS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  SearchBar         │  │  StockBadge        │  │  SocialProofBadge  ││
│  │                    │  │                    │  │                    ││
│  │  • Live dropdown   │  │  • Out of Stock    │  │  • Trending 🔥     ││
│  │  • 300ms debounce  │  │  • Only X left!    │  │  • Best Seller ⭐  ││
│  │  • Product images  │  │  • In Stock ✅     │  │  • Hot Item 🔥     ││
│  │  • Category filter │  │  • Pulse animation │  │  • Gradient style  ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  Breadcrumbs       │  │  ReviewForm        │  │  ReviewsList       ││
│  │                    │  │                    │  │                    ││
│  │  • Home icon       │  │  • 5-star rating   │  │  • Average rating  ││
│  │  • Chevron sep     │  │  • Name input      │  │  • Distribution    ││
│  │  • Schema.org SEO  │  │  • Comment area    │  │  • Review cards    ││
│  │  • Hover effects   │  │  • Validation      │  │  • Verified badge  ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │  SocialProofStats  │  │  ProductCard       │  │  EnhancedToast     ││
│  │                    │  │                    │  │                    ││
│  │  • X viewing now   │  │  • Lazy load image │  │  • Product image   ││
│  │  • Sold X today    │  │  • Stock badge     │  │  • Action buttons  ││
│  │  • X+ views        │  │  • Social badges   │  │  • Haptic feedback ││
│  │  • Real-time       │  │  • Enhanced toast  │  │  • Undo action     ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                        CUSTOM HOOKS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  useEnhancedToast()                                                     │
│  ├─ showEnhancedToast({ title, productName, productImage, action })    │
│  ├─ Returns: Enhanced toast with image + buttons                        │
│  └─ Features: Haptic feedback, auto-dismiss, undo support               │
│                                                                          │
│  useLanguage()                                                          │
│  ├─ Returns: { t(key), language, toggleLanguage }                       │
│  ├─ Provides: 600+ translation keys                                     │
│  └─ Supports: Arabic (RTL) + English (LTR)                              │
│                                                                          │
│  useToast()                                                             │
│  ├─ Returns: { toast, dismiss }                                         │
│  ├─ Standard shadcn/ui toast                                            │
│  └─ Used for: Simple notifications                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                        REDUX STATE MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Store Structure:                                                       │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  cart: {                                                         │  │
│  │    items: Array<{id, name, price, quantity, image}>             │  │
│  │    total: number                                                 │  │
│  │  }                                                               │  │
│  │                                                                  │  │
│  │  wishlist: {                                                     │  │
│  │    items: Array<{id, name, price, image, slug}>                 │  │
│  │  }                                                               │  │
│  │                                                                  │  │
│  │  auth: {                                                         │  │
│  │    user: { id, email, role } | null                             │  │
│  │    isLoading: boolean                                            │  │
│  │  }                                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Actions:                                                               │
│  • addToCart(product)                                                   │
│  • removeFromCart(productId)                                            │
│  • updateQuantity(productId, quantity)                                  │
│  • addToWishlist(product)                                               │
│  • removeFromWishlist(productId)                                        │
│  • setUser(user)                                                        │
│  • clearUser()                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### 1. **Search Flow**
```
User types "ipad" 
  → SearchBar debounces 300ms 
    → GET /api/search?q=ipad 
      → Supabase query: products WHERE name/description ILIKE '%ipad%' 
        → Return 10 results 
          → Display in dropdown with images 
            → User clicks result 
              → Navigate to /products/[slug]
```

### 2. **Review Submission Flow**
```
Customer submits review (5 stars, "Great!") 
  → ReviewForm validates 
    → POST /api/reviews {productId, rating, comment, customerName} 
      → Insert into product_reviews (is_approved=false) 
        → Show toast "Pending approval" 
          → Admin receives notification 
            → Admin approves in /admin/reviews 
              → PUT /api/admin/reviews/[id]/approve 
                → Update is_approved=true 
                  → Review now visible on product page
```

### 3. **Product View Tracking Flow**
```
User visits product page 
  → SocialProofStats component mounts 
    → POST /api/analytics {productId} 
      → Call increment_product_view(productId) RPC 
        → UPSERT product_analytics SET views_count+1, views_today+1 
          → GET /api/analytics?productId=xxx 
            → Return {views_count, sales_today, views_today} 
              → Display "125 viewing now" (simulated) 
                → Update every 30 seconds
```

### 4. **Move to Cart Flow**
```
User clicks "Move to Cart" in wishlist 
  → handleMoveToCart(item) 
    → dispatch(addToCart(item)) 
      → Redux: Add to cart.items[] 
        → dispatch(removeFromWishlist(item.id)) 
          → Redux: Remove from wishlist.items[] 
            → showEnhancedToast({productImage, action:"viewCart"}) 
              → Display toast with "View Cart" button 
                → navigator.vibrate(50) on mobile 
                  → User clicks "View Cart" 
                    → Navigate to /cart
```

---

## 🎯 Performance Optimizations

### Image Optimization:
- ✅ Lazy loading on product cards (`loading="lazy"`)
- ✅ Priority loading on product gallery main image
- ✅ Next.js Image component with automatic optimization
- ✅ Responsive images (srcset)

### API Optimizations:
- ✅ 300ms debouncing on search (prevents spam)
- ✅ Database indexes on foreign keys
- ✅ Atomic SQL operations (prevents race conditions)
- ✅ Non-blocking analytics tracking
- ✅ Pagination on product lists

### Frontend Optimizations:
- ✅ Redux state management (prevents prop drilling)
- ✅ React.memo on expensive components
- ✅ Virtualization for long lists (future)
- ✅ Code splitting (Next.js automatic)

---

## 🔒 Security Features

### Database Security:
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Only approved reviews visible to public
- ✅ Admin actions require authentication
- ✅ SQL injection prevention (parameterized queries)
- ✅ SECURITY DEFINER on SQL functions

### Authentication:
- ✅ Supabase Auth (JWT tokens)
- ✅ Admin role verification
- ✅ Protected API routes
- ✅ Secure session management

### Data Validation:
- ✅ TypeScript type checking
- ✅ Zod validation on API routes
- ✅ Input sanitization
- ✅ Rating bounds (1-5)
- ✅ Quantity checks (stock limits)

---

## 📱 Mobile Optimizations

- ✅ Responsive design (Tailwind breakpoints)
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Haptic feedback (navigator.vibrate)
- ✅ Native share API
- ✅ Swipe gestures (future)
- ✅ Mobile-first CSS
- ✅ Dropdown menus for navigation

---

## 🌍 Internationalization

### Languages Supported:
- 🇵🇸 Arabic (RTL layout)
- 🇺🇸 English (LTR layout)

### Translation Coverage:
- 600+ keys translated
- All UI elements
- Error messages
- Toast notifications
- Admin interface
- Email templates (future)

---

## 🚀 Future Enhancements

### Planned Features:
1. Enhanced filters (best sellers, trending)
2. Public reviews page in footer
3. Email notifications for reviews
4. Advanced analytics dashboard
5. Product comparison tool
6. Wishlist notes
7. Product recommendations
8. Gift card system

### Scalability Improvements:
1. Redis caching for hot products
2. CDN for images
3. Database read replicas
4. API rate limiting
5. WebSocket for real-time updates

---

**This architecture is production-ready and scalable!** 🎊
