"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Minus, Plus, Package, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils/currency"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cart-slice"
import { addToWishlist, removeFromWishlist } from "@/lib/redux/slices/wishlist-slice"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Product } from "@/lib/types/database"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { t } = useLanguage()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const handleAddToCart = () => {
    // Get stock with null safety
    const stock = product.stock_quantity ?? 0
    
    // Check if stock is available
    if (stock <= 0) {
      toast({
        title: t("outOfStockLabel"),
        description: t("backInSoon"),
        variant: "destructive",
      })
      return
    }

    // Check if quantity exceeds stock
    if (quantity > stock) {
      toast({
        title: t("insufficientStock"),
        description: t("cannotExceedStock").replace("{max}", stock.toString()),
        variant: "destructive",
      })
      return
    }

    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "/placeholder.svg?height=400&width=400",
          slug: product.slug,
        }),
      )
    }

    toast({
      title: t("addedToCart"),
      description: t("itemAddedToCart").replace("{name}", product.name).replace("{quantity}", quantity.toString()),
    })
  }

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
      toast({
        title: t("removedFromWishlist"),
        description: t("itemRemovedFromWishlist").replace("{name}", product.name),
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
      toast({
        title: t("addedToWishlist"),
        description: t("itemAddedToWishlist").replace("{name}", product.name),
      })
    }
  }

  const incrementQuantity = () => {
    const stock = product.stock_quantity ?? 0
    if (quantity < stock) {
      setQuantity(quantity + 1)
    } else {
      toast({
        title: t("stockLimitReached").replace("{max}", stock.toString()),
        description: t("cannotExceedStock").replace("{max}", stock.toString()),
        variant: "destructive",
      })
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Calculate stock status
  const stock = product.stock_quantity ?? 0
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock < 10

  return (
    <div className="space-y-6">
      {/* Category */}
      {product.category && (
        <div>
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        </div>
      )}

      {/* Product Name */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{product.name}</h1>
        {product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {hasDiscount && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
            <Badge variant="destructive">{t("save")} {discountPercentage}%</Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {isOutOfStock ? (
          <Badge variant="outline" className="text-destructive border-destructive">
            {t("outOfStockLabel")}
          </Badge>
        ) : isLowStock ? (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Package className="h-3 w-3 ml-1" />
            {t("lowStock").replace("{count}", stock.toString())}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Package className="h-3 w-3 ml-1" />
            {t("stockAvailable").replace("{count}", stock.toString())}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t("selectQuantity")}</label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= stock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {isLowStock && (
              <p className="text-sm text-orange-600 mt-2">
                {t("onlyXLeft").replace("{count}", stock.toString())}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5 ml-2" />
              {t("addToCart")}
            </Button>
            <Button size="lg" variant={isInWishlist ? "default" : "outline"} onClick={handleToggleWishlist}>
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t("fastDelivery")}</p>
            <p className="text-sm text-muted-foreground">{t("freeShippingOver")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t("qualityGuarantee")}</p>
            <p className="text-sm text-muted-foreground">{t("returnPolicy")}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t("securePackaging")}</p>
            <p className="text-sm text-muted-foreground">{t("carefullyPacked")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
