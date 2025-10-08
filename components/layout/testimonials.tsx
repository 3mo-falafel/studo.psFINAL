"use client"

import { useState } from "react"
import { Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/contexts/language-context"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"

interface TestimonialFormProps {
  onSuccess?: () => void
}

export function TestimonialForm({ onSuccess }: TestimonialFormProps) {
  const { t } = useLanguage()
  const { showEnhancedToast } = useEnhancedToast()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !comment.trim()) {
      showEnhancedToast({
        title: t("error"),
        description: t("fillAllFields"),
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          rating,
          comment,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit testimonial")

      showEnhancedToast({
        title: t("reviewSubmitted"),
        description: t("reviewPending"),
      })

      // Reset form and close dialog
      setName("")
      setComment("")
      setRating(5)
      setIsOpen(false)

      onSuccess?.()
    } catch (error) {
      console.error("Testimonial submission error:", error)
      showEnhancedToast({
        title: t("error"),
        description: t("tryAgain"),
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="transition-all hover:scale-105">
          {t("writeReview")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("shareExperience")}</DialogTitle>
          <DialogDescription>
            {t("reviewDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t("yourRating")}</Label>
            <div className="flex gap-2">
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
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-name">{t("yourName")}</Label>
            <Input
              id="testimonial-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterName")}
              required
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-comment">{t("yourReview")}</Label>
            <Textarea
              id="testimonial-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("shareThoughts")}
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("submitReview")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface Testimonial {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

interface TestimonialsDisplayProps {
  testimonials: Testimonial[]
}

export function TestimonialsDisplay({ testimonials }: TestimonialsDisplayProps) {
  const { t } = useLanguage()

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  // Duplicate testimonials to create seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <div className="mt-12 py-8 border-t overflow-hidden">
      <h4 className="text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2">
        <Quote className="h-6 w-6 text-primary" />
        {t("customerReviews")}
      </h4>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Real experiences from our valued customers
      </p>
      
      {/* Infinite scrolling ticker */}
      <div className="relative">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        <div className="overflow-hidden py-4">
          <div 
            className="flex gap-6 animate-scroll-testimonials hover:[animation-play-state:paused]"
            style={{
              animationDuration: `${testimonials.length * 5}s`
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <Card 
                key={`${testimonial.id}-${index}`} 
                className="flex-shrink-0 w-[350px] bg-gradient-to-br from-background to-muted/20 hover:shadow-xl transition-all duration-300 border-muted/50 hover:scale-105"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4 text-center min-h-[80px]">
                    "{testimonial.comment}"
                  </p>
                  <p className="text-sm font-semibold text-center text-primary">
                    — {testimonial.customer_name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
