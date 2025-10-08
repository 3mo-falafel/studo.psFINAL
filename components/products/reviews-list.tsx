"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"
import { formatDistanceToNow } from "date-fns"
import { ar, enUS } from "date-fns/locale"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
}

interface ReviewsListProps {
  reviews: Review[]
  productName: string
}

export function ReviewsList({ reviews, productName }: ReviewsListProps) {
  const { t, language } = useLanguage()

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t("noReviews")}</p>
        <p className="text-sm mt-2">{t("beTheFirst")}</p>
      </div>
    )
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++
  })

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {t("basedOnReviews").replace("{count}", reviews.length.toString())}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviews.length > 0 ? (ratingCounts[stars - 1] / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{ratingCounts[stars - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t("customerReviews")}</h3>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.customer_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {t("verifiedPurchase")}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
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
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: language === "ar" ? ar : enUS
                  })}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
