"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatPrice } from "@/lib/utils/currency"
import { Loader2, Tag, X } from "lucide-react"

interface CheckoutSummaryProps {
  deliveryMethod?: string
  onDiscountApplied?: (discount: { code: string; percentage: number; amount: number }) => void
  onDiscountRemoved?: () => void
}

export function CheckoutSummary({ deliveryMethod, onDiscountApplied, onDiscountRemoved }: CheckoutSummaryProps) {
  const cartItems = useAppSelector((state) => state.cart.items)
  const total = useAppSelector((state) => state.cart.total)

  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    percentage: number
    amount: number
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const subtotal = total
  const shipping = deliveryMethod === "home" ? 20 : 0

  // Calculate discount amount
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const afterDiscount = subtotal - discountAmount
  const grandTotal = afterDiscount + shipping

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setError("الرجاء إدخال كود الخصم")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const response = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        setError(data.error || "كود خصم غير صالح")
        return
      }

      // Calculate discount amount
      const amount = (subtotal * data.discountPercentage) / 100

      const discount = {
        code: data.code,
        percentage: data.discountPercentage,
        amount,
      }

      setAppliedDiscount(discount)
      setDiscountCode("")
      setError("")

      // Notify parent component
      onDiscountApplied?.(discount)
    } catch (err) {
      console.error("Discount validation error:", err)
      setError("فشل التحقق من كود الخصم")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setError("")
    onDiscountRemoved?.()
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {/* Discount Code Input */}
          {!appliedDiscount && (
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="أدخل كود الخصم"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="text-sm"
                  disabled={isValidating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleApplyDiscount()
                    }
                  }}
                />
                <Button type="button" onClick={handleApplyDiscount} disabled={isValidating} size="sm">
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                      جارٍ الفحص...
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 ml-1" />
                      تطبيق
                    </>
                  )}
                </Button>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          )}

          {/* Applied Discount Display */}
          {appliedDiscount && (
            <div className="flex justify-between items-center text-sm bg-green-50 border border-green-200 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-600 text-white">
                  خصم {appliedDiscount.percentage}%
                </Badge>
                <span className="text-xs font-medium text-green-800">{appliedDiscount.code}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          )}

          {appliedDiscount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>الخصم ({appliedDiscount.percentage}%)</span>
              <span className="font-medium">-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الشحن</span>
            <span className="font-medium">{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>المجموع</span>
            <span className="text-primary">{formatPrice(grandTotal)}</span>
          </div>

          {appliedDiscount && (
            <p className="text-xs text-green-600 text-center">
              أنت توفر {formatPrice(discountAmount)} بكود {appliedDiscount.code}!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
