"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/contexts/language-context"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"

interface ReviewFormProps {
  productId: string
  productName: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
  const { t } = useLanguage()
  const { showEnhancedToast } = useEnhancedToast()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !comment.trim()) {
      showEnhancedToast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: name,
          rating,
          comment,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      showEnhancedToast({
        title: t("reviewSubmitted"),
        description: t("reviewPending"),
      })

      // Reset form
      setName("")
      setComment("")
      setRating(5)

      onSuccess?.()
    } catch (error) {
      console.error("Review submission error:", error)
      showEnhancedToast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("writeReview")}</CardTitle>
        <CardDescription>{t("beTheFirst")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <Label>{t("rating")}</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {rating} {t("stars")}
              </span>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">{t("yourName")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">{t("yourReview")}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share your experience with ${productName}...`}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t("loading") : t("submitReview")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
