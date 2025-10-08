# 🎯 FINAL STEP - Copy Admin Reviews Page

## ⚠️ The file creation tool keeps corrupting the page.tsx file

## ✅ What's Already Done:
1. ✅ SQL Script 12 executed (RLS policies fixed)
2. ✅ All 6 Admin APIs created and working
3. ✅ Footer testimonials enhanced (4-column grid, gradients, hover effects)
4. ✅ Dev server running on http://localhost:3001

## 📋 What You Need To Do:

### Copy the Admin Reviews Page Manually:

1. **Open**: `FINAL_REVIEWS_SUMMARY.md` (in your project root)
2. **Scroll to**: The TypeScript code block (starts with `"use client"`)
3. **Select ALL code** from:
   - `"use client"` (line 23)
   - Down to the final `}` (line 428)
4. **Copy** the entire code block
5. **Create new file**: `app/admin/reviews/page.tsx`
6. **Paste** the code
7. **Save** the file

### Alternative - Use This PowerShell Command:

```powershell
# Copy this entire command and run it in PowerShell:

$code = @'
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
'@

$code | Out-File -FilePath "app\admin\reviews\page.tsx" -Encoding UTF8
Write-Host "✅ File created successfully!"
```

## 🎯 Then Visit:

- **Admin Dashboard**: http://localhost:3001/admin/reviews
- **Your Site**: http://localhost:3001

## 🎉 Everything else is complete and working!
