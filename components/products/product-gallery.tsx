"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image - 3x size = nice large size */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted max-w-[420px] sm:max-w-[480px] mx-auto">
        <Image
          src={displayImages[selectedImage] || "/placeholder.svg"}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          loading="eager"
          priority={selectedImage === 0}
          className="object-cover"
        />
        
        {/* Navigation Arrows - only show if multiple images */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {/* Image counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
              {selectedImage + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Images - Horizontal scrollable */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-[420px] sm:max-w-[480px] mx-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
