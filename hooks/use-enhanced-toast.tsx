"use client"

import { useToast as useBaseToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"

interface EnhancedToastOptions {
  title: string
  description?: string
  productName?: string
  productImage?: string
  action?: "viewCart" | "viewWishlist" | "custom"
  actionLabel?: string
  onActionClick?: () => void
  variant?: "default" | "destructive"
}

export function useEnhancedToast() {
  const { toast } = useBaseToast()
  const router = useRouter()
  const { t } = useLanguage()

  const showEnhancedToast = ({
    title,
    description,
    productName,
    productImage,
    action,
    actionLabel,
    onActionClick,
    variant = "default"
  }: EnhancedToastOptions) => {
    // Vibrate on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50)
    }

    // Prepare description with product info
    let enhancedDescription = description

    if (productName && productImage) {
      enhancedDescription = (
        <div className="flex items-center gap-3 mt-2">
          <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm line-clamp-1">{productName}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
      ) as any
    }

    // Prepare action button
    let actionButton

    if (action === "viewCart") {
      actionButton = (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => router.push("/cart")}
          className="gap-2"
        >
          <ShoppingCart className="h-3 w-3" />
          {t("viewCart")}
        </Button>
      )
    } else if (action === "viewWishlist") {
      actionButton = (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => router.push("/wishlist")}
          className="gap-2"
        >
          <Heart className="h-3 w-3" />
          {t("viewWishlist")}
        </Button>
      )
    } else if (action === "custom" && onActionClick) {
      actionButton = (
        <Button size="sm" variant="outline" onClick={onActionClick}>
          {actionLabel || t("undo")}
        </Button>
      )
    }

    toast({
      title,
      description: enhancedDescription,
      action: actionButton,
      variant,
      duration: 4000, // Show for 4 seconds
    })
  }

  return { showEnhancedToast, toast }
}
