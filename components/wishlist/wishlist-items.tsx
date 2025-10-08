"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingCart, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockBadge } from "@/components/products/stock-badge"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { removeFromWishlist } from "@/lib/redux/slices/wishlist-slice"
import { addToCart } from "@/lib/redux/slices/cart-slice"
import { useEnhancedToast } from "@/hooks/use-enhanced-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState } from "react"

export function WishlistItems() {
  const { t } = useLanguage()
  const dispatch = useAppDispatch()
  const { showEnhancedToast } = useEnhancedToast()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const [sharingWishlist, setSharingWishlist] = useState(false)

  const handleRemove = (id: string, name: string, image: string) => {
    dispatch(removeFromWishlist(id))
    showEnhancedToast({
      title: t("removedFromWishlist"),
      productName: name,
      productImage: image,
      action: "custom",
      actionLabel: t("undo"),
      onActionClick: () => {
        dispatch(addToCart({ id, name, price: 0, image, slug: "" })) // Re-add if needed
      }
    })
  }

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    // Add to cart
    dispatch(addToCart(item))
    // Remove from wishlist
    dispatch(removeFromWishlist(item.id))
    
    showEnhancedToast({
      title: t("moveToCart"),
      description: t("addedToCartDesc").replace("{name}", item.name),
      productName: item.name,
      productImage: item.image,
      action: "viewCart"
    })
  }

  const handleShareWishlist = async () => {
    if (wishlistItems.length === 0) return

    setSharingWishlist(true)

    try {
      // Create share link
      const shareUrl = `${window.location.origin}/wishlist/shared?items=${wishlistItems.map(i => i.id).join(',')}`
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      
      showEnhancedToast({
        title: t("wishlistShared"),
        description: "Link copied to clipboard!",
      })

      // Try native share if available
      if (navigator.share) {
        await navigator.share({
          title: "My Wishlist - Studo.ps",
          text: "Check out my wishlist!",
          url: shareUrl,
        })
      }
    } catch (error) {
      console.error("Share error:", error)
    } finally {
      setSharingWishlist(false)
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">{t("cartEmpty")}</p>
          <Button asChild>
            <Link href="/shop">{t("continueShopping")}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Share Wishlist Button */}
      <div className="mb-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleShareWishlist}
          disabled={sharingWishlist}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          {t("shareWishlist")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlistItems.map((item) => (
        <Card key={item.id} className="group overflow-hidden">
          <Link href={`/products/${item.slug}`}>
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          <CardContent className="p-4">
            <Link href={`/products/${item.slug}`}>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                {item.name}
              </h3>
            </Link>

            <p className="text-xl font-bold text-primary mb-4">₪{item.price.toLocaleString()}</p>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full gap-2" onClick={() => handleMoveToCart(item)}>
                <ShoppingCart className="h-4 w-4" />
                {t("moveToCart")}
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2" 
                onClick={() => handleRemove(item.id, item.name, item.image)}
              >
                <Trash2 className="h-4 w-4" />
                {t("removedFromWishlist")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  )
}
