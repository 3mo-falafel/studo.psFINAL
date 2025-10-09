"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cart-slice"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/contexts/language-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function CartItems() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { t } = useLanguage()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [loadingStockCheck, setLoadingStockCheck] = useState<string | null>(null)

  const handleRemove = (id: string, name: string) => {
    dispatch(removeFromCart(id))
    toast({
      title: t("removedFromCart"),
      description: t("itemRemovedFromCart").replace("{name}", name),
    })
  }

  const handleUpdateQuantity = async (id: string, newQuantity: number, productName: string) => {
    // If decreasing, just update
    if (newQuantity < (cartItems.find(item => item.id === id)?.quantity || 0)) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
      return
    }

    // If increasing, check stock first
    setLoadingStockCheck(id)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: product, error } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", id)
        .single()

      if (error || !product) {
        toast({
          title: t("insufficientStock"),
          description: "Could not verify stock availability",
          variant: "destructive",
        })
        setLoadingStockCheck(null)
        return
      }

      const availableStock = product.stock_quantity ?? 0

      if (newQuantity > availableStock) {
        toast({
          title: t("insufficientStock"),
          description: t("cannotExceedStock").replace("{max}", availableStock.toString()),
          variant: "destructive",
        })
        setLoadingStockCheck(null)
        return
      }

      dispatch(updateQuantity({ id, quantity: newQuantity }))
    } catch (error) {
      console.error("Stock check error:", error)
      toast({
        title: "Error",
        description: "Could not verify stock availability",
        variant: "destructive",
      })
    } finally {
      setLoadingStockCheck(null)
    }
  }

  if (cartItems.length === 0) {
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
    <div className="space-y-4">
      {cartItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-lg font-bold text-primary mb-3">Rs. {item.price.toLocaleString()}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.name)}
                    disabled={item.quantity <= 1 || loadingStockCheck === item.id}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.name)}
                    disabled={loadingStockCheck === item.id}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Item Total & Remove */}
              <div className="flex flex-col items-end justify-between">
                <p className="text-xl font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemove(item.id, item.name)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
