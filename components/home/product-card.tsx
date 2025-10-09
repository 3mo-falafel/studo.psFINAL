"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils/currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockBadge, SocialProofBadge } from "@/components/products/stock-badge"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cart-slice"
import { addToWishlist, removeFromWishlist } from "@/lib/redux/slices/wishlist-slice"
import type { Product } from "@/lib/types/database"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { useProductStock } from "@/hooks/use-realtime-stock"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const dispatch = useAppDispatch()
  const { showEnhancedToast } = useEnhancedToast()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const cartItems = useAppSelector((state) => state.cart.items) // Get cart items for stock validation
  
  // Get real-time stock data
  const { stock, isOutOfStock, isLowStock } = useProductStock(product.id, product.stock_quantity)

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const handleAddToCart = () => {
    const existingItem = cartItems.find(item => item.id === product.id)
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0
    
    if (isOutOfStock) {
      showEnhancedToast({
        title: t("outOfStockLabel"),
        description: t("backInSoon"),
        variant: "destructive",
      })
      return
    }
    
    if (currentQuantityInCart >= stock) {
      showEnhancedToast({
        title: t("stockLimitReached"),
        description: `Maximum stock (${stock}) reached in cart`,
        variant: "destructive",
      })
      return
    }
    
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg?height=400&width=400",
        slug: product.slug,
        stock: stock, // Pass real-time stock for validation
      }),
    )

    showEnhancedToast({
      title: t("addedToCart"),
      productName: product.name,
      productImage: product.images[0] || "/placeholder.svg?height=400&width=400",
      action: "viewCart",
      variant: "default",
      showSuccessIcon: true
    })
  }

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
      showEnhancedToast({
        title: t("removedFromWishlist"),
        productName: product.name,
        productImage: product.images[0] || "/placeholder.svg?height=400&width=400",
        action: "custom",
        actionLabel: t("undo"),
        onActionClick: () => {
          dispatch(
            addToWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] || "/placeholder.svg?height=400&width=400",
              slug: product.slug,
            }),
          )
        }
      })
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "/placeholder.svg?height=400&width=400",
          slug: product.slug,
        }),
      )
      showEnhancedToast({
        title: t("addedToWishlist"),
        productName: product.name,
        productImage: product.images[0] || "/placeholder.svg?height=400&width=400",
        action: "viewWishlist",
        showSuccessIcon: true
      })
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground shadow-lg animate-scale-in text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="absolute top-2 left-2 bg-primary shadow-lg animate-scale-in delay-100 text-xs">{t("featured")}</Badge>
          )}
          {/* Social Proof Badges */}
          {product.trending && (
            <SocialProofBadge type="trending" className="absolute top-2 right-2 text-xs" />
          )}
          {product.best_seller && !product.trending && (
            <SocialProofBadge type="bestSeller" className="absolute top-2 right-2 text-xs" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <CardContent className="p-3 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-lg mb-1.5 md:mb-2 line-clamp-2 hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
          <span className="text-base md:text-xl font-bold text-primary">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Stock Badge - Using Real-Time Stock */}
        <StockBadge quantity={stock} className="text-xs" showIcon={true} />
      </CardContent>

      <CardFooter className="p-3 md:p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md text-xs md:text-sm h-8 md:h-10"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-3 md:h-4 w-3 md:w-4 ml-1 md:ml-2" />
          {isOutOfStock ? t("outOfStockLabel") : t("addToCart")}
        </Button>
        <Button
          variant={isInWishlist ? "default" : "outline"}
          size="icon"
          onClick={handleToggleWishlist}
          className="transition-all duration-300 hover:scale-110 h-8 w-8 md:h-10 md:w-10"
        >
          <Heart className={`h-3 md:h-4 w-3 md:w-4 transition-all ${isInWishlist ? "fill-current scale-110" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  )
}
