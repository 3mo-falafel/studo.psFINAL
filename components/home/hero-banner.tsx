"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner } from "@/lib/types/database"

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  if (banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
      {/* Banner Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20">
        <Image
          src={currentBanner.image_url || "/placeholder.svg"}
          alt={currentBanner.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">{currentBanner.title}</h1>
            {currentBanner.subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6 text-pretty">{currentBanner.subtitle}</p>
            )}
            {currentBanner.button_text && (
              <Button size="lg" asChild>
                <Link href={currentBanner.link_url || "/shop"}>{currentBanner.button_text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-background/60"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
