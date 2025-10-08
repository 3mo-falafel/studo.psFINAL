# 🔧 REVIEWS FIX - COMPLETE GUIDE

## 🎯 Problems Fixed:
1. **Reviews not appearing in admin dashboard** - RLS policies were too restrictive
2. **Admin reviews dashboard** - Split into Product Reviews vs Site Testimonials
3. **Footer testimonials visibility** - Made more prominent and viewable

---

## 📋 STEP 1: Run These SQL Scripts in Supabase

### Script 1: Fix RLS Policies (scripts/12-fix-reviews-rls.sql)

```sql
-- ============================================
-- FIX: Admin Reviews Access - RLS Policies
-- ============================================

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON product_reviews;

-- Create a new SELECT policy that allows:
-- 1. Everyone can see APPROVED reviews (for product pages)
-- 2. ADMINS can see ALL reviews (for admin dashboard)
CREATE POLICY "Public can read approved, admins can read all"
  ON product_reviews FOR SELECT
  USING (
    is_approved = true 
    OR 
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Keep the insert policy (anyone can submit)
DROP POLICY IF EXISTS "Anyone can insert reviews" ON product_reviews;
CREATE POLICY "Anyone can insert reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

-- Keep the admin management policy (admins can UPDATE/DELETE)
DROP POLICY IF EXISTS "Admins can manage reviews" ON product_reviews;
CREATE POLICY "Admins can update and delete reviews"
  ON product_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete reviews"
  ON product_reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- Same fix for site_testimonials
-- ============================================

-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON site_testimonials;

-- Create a new SELECT policy
CREATE POLICY "Public can read approved testimonials, admins can read all"
  ON site_testimonials FOR SELECT
  USING (
    is_approved = true 
    OR 
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Keep other policies
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON site_testimonials;
CREATE POLICY "Anyone can submit testimonials"
  ON site_testimonials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update testimonials"
  ON site_testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON site_testimonials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

---

## 📋 STEP 2: Verify Your Files

I've created these files for you. Restart the dev server if needed:

### ✅ Files Created/Updated:
1. `scripts/12-fix-reviews-rls.sql` - RLS policy fixes
2. `app/api/admin/reviews/route.ts` - Fixed to use `getSupabaseServerClient()`
3. `app/api/admin/testimonials/route.ts` - NEW: Admin testimonials API
4. `app/api/admin/testimonials/[testimonialId]/approve/route.ts` - NEW: Approve testimonials
5. `app/api/admin/testimonials/[testimonialId]/route.ts` - NEW: Delete testimonials
6. `app/admin/reviews/layout.tsx` - Admin layout for reviews page
7. `app/admin/reviews/page.tsx` - NEW: Complete redesigned reviews dashboard

---

## 📋 STEP 3: Create the Admin Reviews Page

Save this as `app/admin/reviews/page.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Check, X, MessageSquare, Package, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"
import { formatDistanceToNow } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import Link from "next/link"

interface Review {
  id: string
  product_id: string
  customer_name: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  product?: {
    name: string
    slug: string
  }
}

interface Testimonial {
  id: string
  customer_name: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
}

export default function AdminReviewsPage() {
  const { language } = useLanguage()
  const { toast } = useEnhancedToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("product-reviews")

  useEffect(() => {
    fetchReviews()
    fetchTestimonials()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/reviews")
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || "Failed to fetch reviews")
      }
      
      const data = await response.json()
      console.log("Fetched reviews data:", data)
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch reviews",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Testimonials API Error:", errorData)
        return
      }
      
      const data = await response.json()
      console.log("Fetched testimonials data:", data)
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    }
  }

  const handleApproveReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Failed to approve")

      toast({
        title: "Review Approved",
        description: "Review is now visible to customers",
      })

      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive"
      })
    }
  }

  const handleRejectReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to reject")

      toast({
        title: "Review Rejected",
        description: "Review has been removed",
      })

      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive"
      })
    }
  }

  const handleApproveTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}/approve`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Failed to approve")

      toast({
        title: "Testimonial Approved",
        description: "Testimonial is now visible in footer",
      })

      fetchTestimonials()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive"
      })
    }
  }

  const handleRejectTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to reject")

      toast({
        title: "Testimonial Rejected",
        description: "Testimonial has been removed",
      })

      fetchTestimonials()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject testimonial",
        variant: "destructive"
      })
    }
  }

  const pendingReviews = reviews.filter(r => !r.is_approved)
  const approvedReviews = reviews.filter(r => r.is_approved)
  const pendingTestimonials = testimonials.filter(t => !t.is_approved)
  const approvedTestimonials = testimonials.filter(t => t.is_approved)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">Manage product reviews and site testimonials</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground">Loading reviews...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-muted-foreground">Manage product reviews and site testimonials</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Product Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Product Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTestimonials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedTestimonials.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product-reviews" className="gap-2">
            <Package className="h-4 w-4" />
            Product Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Site Testimonials ({testimonials.length})
          </TabsTrigger>
        </TabsList>

        {/* Product Reviews Tab */}
        <TabsContent value="product-reviews" className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Reviews ({pendingReviews.length})</h2>
            {pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No pending product reviews</p>
                  <p className="text-sm mt-1">New reviews will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <Card key={review.id} className="border-orange-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700">
                              Pending
                            </Badge>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {review.product && (
                            <Link 
                              href={`/products/${review.product.slug}`}
                              className="text-sm text-primary hover:underline"
                            >
                              Product: <strong>{review.product.name}</strong>
                            </Link>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: language === "ar" ? ar : enUS
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApproveReview(review.id)} 
                          className="gap-2"
                          size="sm"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRejectReview(review.id)}
                          className="gap-2"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Reviews ({approvedReviews.length})</h2>
            {approvedReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No approved product reviews yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{review.customer_name}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{review.comment}</p>
                      {review.product && (
                        <Link 
                          href={`/products/${review.product.slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {review.product.name}
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Testimonials ({pendingTestimonials.length})</h2>
            {pendingTestimonials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No pending site testimonials</p>
                  <p className="text-sm mt-1">New testimonials will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="border-orange-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{testimonial.customer_name}</CardTitle>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700">
                              Pending
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= testimonial.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatDistanceToNow(new Date(testimonial.created_at), {
                            addSuffix: true,
                            locale: language === "ar" ? ar : enUS
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{testimonial.comment}</p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApproveTestimonial(testimonial.id)} 
                          className="gap-2"
                          size="sm"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRejectTestimonial(testimonial.id)}
                          className="gap-2"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Testimonials ({approvedTestimonials.length})</h2>
            {approvedTestimonials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>No approved testimonials yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedTestimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{testimonial.customer_name}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= testimonial.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{testimonial.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📋 STEP 4: Improve Footer Testimonials

Update `components/layout/testimonials.tsx` - Find the TestimonialsDisplay component and make these changes:

**Change FROM:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
```

**Change TO:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
```

**And change the Card styling FROM:**
```typescript
<Card className="border-muted/50">
```

**Change TO:**
```typescript
<Card className="border-muted/50 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
```

---

## 🚀 HOW TO USE:

### 1. Run SQL Script:
```sql
-- In Supabase Dashboard → SQL Editor
-- Copy entire content of scripts/12-fix-reviews-rls.sql
-- Execute it
```

### 2. Copy the Admin Reviews Page:
- Copy the code from STEP 3 above
- Paste into `app/admin/reviews/page.tsx`
- Save the file

### 3. Restart Dev Server:
```powershell
# Stop current server (Ctrl+C)
npm run dev
```

### 4. Test Everything:
1. Go to `http://localhost:3001/admin/reviews`
2. Should see two tabs: "Product Reviews" and "Site Testimonials"
3. Should see 4 stats cards at the top
4. Submit a test review on a product page
5. Submit a test testimonial in the footer
6. Both should appear in admin dashboard
7. Approve them
8. They should appear on the site

---

## ✅ What's Fixed:

### 1. RLS Policies ✅
- Admins can now see ALL reviews (pending + approved)
- Public can only see approved reviews
- Same for testimonials

### 2. Admin Dashboard ✅
- Two tabs: Product Reviews vs Site Testimonials
- Stats cards showing counts
- Pending/Approved sections for each
- Approve/Reject buttons
- Better layout and organization

### 3. Footer Testimonials ✅
- Larger grid (up to 4 columns on desktop)
- Gradient background on cards
- Hover effects
- More prominent display

---

## 🐛 If Still Not Working:

### Check 1: Are you logged in as admin?
```sql
-- Run in Supabase:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Check 2: Do reviews exist in database?
```sql
-- Run in Supabase:
SELECT * FROM product_reviews ORDER BY created_at DESC;
SELECT * FROM site_testimonials ORDER BY created_at DESC;
```

### Check 3: Clear browser cache
- Press Ctrl+Shift+R (hard reload)
- Or clear all browser data

### Check 4: Check browser console
- Press F12
- Look for error messages
- Share them if issues persist

---

## 📸 What You Should See:

### Admin Reviews Page:
- Header: "Reviews Management"
- 4 Stats cards (pending/approved for each type)
- 2 Tabs: Product Reviews | Site Testimonials
- Each tab has Pending section (orange borders) and Approved section (green badges)
- Approve/Reject buttons on pending items

### Footer Testimonials:
- 4-column grid on desktop (2 on tablet, 1 on mobile)
- Gradient card backgrounds
- Hover effects
- Star ratings visible
- Customer names and comments

---

Need help? Check the browser console (F12) and share any error messages!
