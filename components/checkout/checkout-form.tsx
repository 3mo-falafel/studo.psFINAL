"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { clearCart } from "@/lib/redux/slices/cart-slice"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils/currency"
import type { Address } from "@/lib/types/database"
import type { User } from "@supabase/supabase-js"
import { MapPin, GraduationCap, Truck } from "lucide-react"

interface CheckoutFormProps {
  onDeliveryMethodChange?: (method: string) => void
  onDiscountApplied?: (discount: { code: string; percentage: number; amount: number }) => void
  appliedDiscount?: { code: string; percentage: number; amount: number } | null
}

export function CheckoutForm({ onDeliveryMethodChange, onDiscountApplied, appliedDiscount: externalDiscount }: CheckoutFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const cartItems = useAppSelector((state) => state.cart.items)
  const total = useAppSelector((state) => state.cart.total)

  const [deliveryMethod, setDeliveryMethod] = useState<"birzeit" | "billin" | "home">("birzeit")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use external discount if provided (from parent), otherwise use internal state
  const appliedDiscount = externalDiscount || null

  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Palestine",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getShippingCost = () => {
    if (deliveryMethod === "birzeit" || deliveryMethod === "billin") return 0
    return 20 // ₪20 for home delivery
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة منتجات لسلة التسوق قبل إتمام الطلب",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      let shippingAddress
      if (deliveryMethod === "birzeit") {
        shippingAddress = {
          full_name: formData.fullName,
          whatsapp: formData.whatsapp,
          address_line1: "Birzeit University",
          address_line2: "Pickup Point",
          city: "Birzeit",
          state: "Ramallah",
          postal_code: "",
          country: "Palestine",
        }
      } else if (deliveryMethod === "billin") {
        shippingAddress = {
          full_name: formData.fullName,
          whatsapp: formData.whatsapp,
          address_line1: "Billin Village",
          address_line2: "Pickup Point",
          city: "Billin",
          state: "Ramallah",
          postal_code: "",
          country: "Palestine",
        }
      } else {
        shippingAddress = {
          full_name: formData.fullName,
          whatsapp: formData.whatsapp,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
        }
      }

      const subtotal = total
      const shipping = getShippingCost()

      // Apply discount if any
      const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
      const afterDiscount = subtotal - discountAmount
      const grandTotal = afterDiscount + shipping

      // Validate stock availability for each item before submitting
      try {
        const stockValidation = await fetch("/api/products/validate-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              id: item.id,
              quantity: item.quantity || 1
            }))
          }),
        })

        const stockData = await stockValidation.json()
        
        if (!stockData.valid) {
          const outOfStockItems = stockData.items?.filter((item: any) => !item.available) || []
          const lowStockItems = stockData.items?.filter((item: any) => item.available && item.requested > item.stock) || []
          
          let errorMessage = ""
          if (outOfStockItems.length > 0) {
            errorMessage = `Out of stock: ${outOfStockItems.map((item: any) => item.name).join(", ")}`
          } else if (lowStockItems.length > 0) {
            errorMessage = `Insufficient stock for: ${lowStockItems.map((item: any) => `${item.name} (only ${item.stock} available)`).join(", ")}`
          }
          
          toast({
            title: "مخزون غير كافٍ",
            description: errorMessage,
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      } catch (error) {
        console.error("Stock validation error:", error)
        // Continue with order if stock validation fails (backwards compatibility)
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress,
          deliveryMethod,
          paymentMethod,
          subtotal,
          discountCode: appliedDiscount?.code || null,
          discountAmount,
          shipping,
          tax: 0,
          total: grandTotal,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const data = await response.json()
      const { orderId, orderNumber, discountCode, discountPercentage } = data

      // Mark the discount code as used if one was applied
      if (appliedDiscount) {
        await fetch("/api/discount", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: appliedDiscount.code,
            orderId,
          }),
        })
      }

      dispatch(clearCart())

      // Redirect to success page with discount code if earned
      const params = new URLSearchParams({
        orderId,
        orderNumber,
      })

      if (discountCode) {
        params.append("discountCode", discountCode)
        params.append("discountPercentage", discountPercentage.toString())
      }

      router.push(`/checkout/success?${params.toString()}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "فشل الطلب",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات التواصل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">الاسم الكامل *</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                placeholder="أدخل اسمك الكامل"
                value={formData.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">رقم الواتساب *</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="+972 59-976-5211"
                value={formData.whatsapp}
                onChange={handleInputChange}
                required
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>طريقة التوصيل</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={deliveryMethod}
            onValueChange={(value: any) => {
              setDeliveryMethod(value)
              onDeliveryMethodChange?.(value)
            }}
          >
            <div className="flex items-start space-x-3 space-x-reverse border-2 border-primary rounded-lg p-4 bg-primary/5">
              <RadioGroupItem value="birzeit" id="birzeit" className="mt-1" />
              <Label htmlFor="birzeit" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 font-semibold text-primary mb-1">
                  <GraduationCap className="h-5 w-5" />
                  توصيل مجاني لجامعة بيرزيت
                </div>
                <div className="text-sm text-muted-foreground">استلام من الحرم الجامعي - بدون رسوم توصيل</div>
                <div className="text-lg font-bold text-primary mt-2">مجاني</div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse border-2 border-primary rounded-lg p-4 bg-primary/5">
              <RadioGroupItem value="billin" id="billin" className="mt-1" />
              <Label htmlFor="billin" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 font-semibold text-primary mb-1">
                  <MapPin className="h-5 w-5" />
                  استلام مجاني من قرية بلعين
                </div>
                <div className="text-sm text-muted-foreground">استلام من موقعنا - بدون رسوم توصيل</div>
                <div className="text-lg font-bold text-primary mt-2">مجاني</div>
              </Label>
            </div>

            <div className="flex items-start space-x-3 space-x-reverse border rounded-lg p-4">
              <RadioGroupItem value="home" id="home" className="mt-1" />
              <Label htmlFor="home" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Truck className="h-5 w-5" />
                  توصيل للمنزل
                </div>
                <div className="text-sm text-muted-foreground">التوصيل لعنوانك</div>
                <div className="text-lg font-bold text-primary mt-2">₪20.00</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {deliveryMethod === "home" && (
        <Card>
          <CardHeader>
            <CardTitle>عنوان التوصيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="addressLine1">العنوان - السطر الأول *</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                placeholder="اسم الشارع ورقم المبنى"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">العنوان - السطر الثاني</Label>
              <Input 
                id="addressLine2" 
                name="addressLine2" 
                placeholder="رقم الشقة، الطابق، إلخ (اختياري)"
                value={formData.addressLine2} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">المدينة *</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="state">المحافظة *</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>طريقة الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-4">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="cursor-pointer flex-1">
                <div className="font-medium">الدفع عند الاستلام</div>
                <div className="text-sm text-muted-foreground">ادفع عندما تستلم طلبك</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات الطلب (اختياري)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            name="notes"
            placeholder="أي تعليمات خاصة لطلبك..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
          />
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
        {isSubmitting ? "جارٍ المعالجة..." : `تأكيد الطلب - ${formatPrice(total + getShippingCost())}`}
      </Button>
    </form>
  )
}
