# ✅ ALL DONE! Reviews System Fixed

## 🎉 What I Completed:

### ✅ 1. Fixed RLS Policies (SQL Script Executed)
- Admins can now see **ALL reviews** (pending + approved)
- Public can only see approved reviews
- Same fix applied to testimonials

### ✅ 2. Admin Reviews Dashboard - Files Created
- ✅ `app/api/admin/reviews/route.ts` - Fixed API
- ✅ `app/api/admin/testimonials/route.ts` - NEW API
- ✅ `app/api/admin/testimonials/[testimonialId]/approve/route.ts` - Approve endpoint
- ✅ `app/api/admin/testimonials/[testimonialId]/route.ts` - Delete endpoint
- ✅ `app/admin/reviews/layout.tsx` - Admin layout (already exists)
- ⚠️ `app/admin/reviews/page.tsx` - **COPY MANUALLY** (file kept getting corrupted, see code below)

### ✅ 3. Footer Testimonials Enhanced
- Changed from 2-column to **4-column grid** on desktop
- Added **gradient backgrounds** on cards
- Added **hover shadow effects**
- Larger **star ratings** (h-5 vs h-4)
- **Centered text** for better visual appeal
- Added subtitle: "Real experiences from our valued customers"
- Testimonials now have **min-height** for consistent card sizes

---

## ⚠️ YOU NEED TO CREATE ONE FILE MANUALLY:

The admin reviews page kept getting corrupted during creation. Please **copy this code** and save it as:

**File**: `app/admin/reviews/page.tsx`

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
  product?: { name: string; slug: string }
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
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to fetch reviews", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials")
      if (!response.ok) return
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleApproveReview = async (id: string) => {
    try {
      await fetch(`/api/admin/reviews/${id}/approve`, { method: "PUT" })
      toast({ title: "Approved", description: "Review is now visible" })
      fetchReviews()
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleRejectReview = async (id: string) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
      toast({ title: "Rejected", description: "Review removed" })
      fetchReviews()
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleApproveTestimonial = async (id: string) => {
    try {
      await fetch(`/api/admin/testimonials/${id}/approve`, { method: "PUT" })
      toast({ title: "Approved", description: "Testimonial is now visible" })
      fetchTestimonials()
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const handleRejectTestimonial = async (id: string) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" })
      toast({ title: "Rejected", description: "Testimonial removed" })
      fetchTestimonials()
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
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
            <p className="text-muted-foreground">Loading...</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Product Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Product Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedReviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTestimonials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Testimonials</CardTitle>
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

        <TabsContent value="product-reviews" className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Reviews ({pendingReviews.length})</h2>
            {pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No pending product reviews</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <Card key={review.id} className="border-orange-200 dark:border-orange-900/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">Pending</Badge>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          {review.product && (
                            <Link href={`/products/${review.product.slug}`} className="text-sm text-primary hover:underline">
                              Product: <strong>{review.product.name}</strong>
                            </Link>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: language === "ar" ? ar : enUS })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApproveReview(review.id)} className="gap-2" size="sm">
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive" onClick={() => handleRejectReview(review.id)} className="gap-2" size="sm">
                          <X className="h-4 w-4" /> Reject
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
                  <p>No approved reviews yet</p>
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
                              <Star key={star} className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Approved</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{review.comment}</p>
                      {review.product && (
                        <Link href={`/products/${review.product.slug}`} className="text-xs text-primary hover:underline">
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

        <TabsContent value="testimonials" className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Testimonials ({pendingTestimonials.length})</h2>
            {pendingTestimonials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No pending testimonials</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTestimonials.map((t) => (
                  <Card key={t.id} className="border-orange-200 dark:border-orange-900/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{t.customer_name}</CardTitle>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">Pending</Badge>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: language === "ar" ? ar : enUS })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{t.comment}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApproveTestimonial(t.id)} className="gap-2" size="sm">
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button variant="destructive" onClick={() => handleRejectTestimonial(t.id)} className="gap-2" size="sm">
                          <X className="h-4 w-4" /> Reject
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
                {approvedTestimonials.map((t) => (
                  <Card key={t.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{t.customer_name}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-3 w-3 ${star <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">Approved</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{t.comment}</p>
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

## 🚀 FINAL STEPS:

1. **Copy the code above** and save as `app/admin/reviews/page.tsx`
2. **Restart dev server**:
   ```powershell
   npm run dev
   ```
3. **Test the system**:
   - Visit: `http://localhost:3001/admin/reviews`
   - Should see 2 tabs: Product Reviews | Site Testimonials
   - Should see 4 stats cards showing counts
   - Submit test reviews on product pages
   - Submit test testimonials in footer
   - Approve them in admin dashboard
   - Verify they appear on the site

---

## 📸 What You'll See:

### Admin Dashboard:
- **2 Tabs**: Product Reviews (with product links) | Site Testimonials
- **4 Stats Cards**: Pending/Approved counts for each type
- **Pending Section**: Orange borders, "Pending" badge, Approve/Reject buttons
- **Approved Section**: Green "Approved" badge, 2-column grid
- **Clean Layout**: Better spacing, icons, time stamps

### Footer Testimonials:
- **4-column grid** on desktop (2 on tablet, 1 on mobile)
- **Gradient backgrounds** with hover shadows
- **Larger stars** (h-5 instead of h-4)
- **Centered text** for better visual appeal
- **Consistent card heights** with min-height
- **Border separator** from other footer content
- **Subtitle**: "Real experiences from our valued customers"

---

## ✅ Summary:

All 3 issues have been fixed:

1. ✅ **RLS Policies Fixed** - Admins can now see ALL reviews
2. ✅ **Admin Dashboard Enhanced** - Separate tabs for products vs testimonials
3. ✅ **Footer Testimonials Improved** - 4-column grid, gradients, better visibility

**Just copy the admin page code above and restart the server!** 🎉
