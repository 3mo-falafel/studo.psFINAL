"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/lib/redux/hooks"
import { useLanguage } from "@/lib/contexts/language-context"

export function CartSummary() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const total = useAppSelector((state) => state.cart.total)
  const { t } = useLanguage()

  const subtotal = total
  const shipping = subtotal >= 5000 ? 0 : 250
  const tax = Math.round(subtotal * 0.0) // 0% tax for now
  const grandTotal = subtotal + shipping + tax

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{t("orderSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("products")} ({itemCount})</span>
          <span className="font-medium">₪ {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("shipping")}</span>
          <span className="font-medium">{shipping === 0 ? t("free") : `₪ ${shipping.toLocaleString()}`}</span>
        </div>

        {shipping > 0 && <p className="text-xs text-muted-foreground">{t("freeShippingOver")}</p>}

        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("tax")}</span>
            <span className="font-medium">₪ {tax.toLocaleString()}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>{t("total")}</span>
          <span>₪ {grandTotal.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="lg" disabled={cartItems.length === 0}>
          <Link href="/checkout">{t("proceedToCheckout")}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
