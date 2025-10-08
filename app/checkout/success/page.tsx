"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, Home, ShoppingBag, Gift, Copy, Check } from "lucide-react"
import confetti from "canvas-confetti"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const orderId = searchParams.get("orderId")
  const orderNumber = searchParams.get("orderNumber")
  const discountCode = searchParams.get("discountCode")
  const discountPercentage = searchParams.get("discountPercentage")

  useEffect(() => {
    // Trigger confetti animation
    if (!showConfetti && orderId) {
      setShowConfetti(true)
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#22c55e", "#10b981", "#059669"],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#22c55e", "#10b981", "#059669"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
    }
  }, [orderId, showConfetti])

  // If no order info, redirect to home
  useEffect(() => {
    if (!orderId || !orderNumber) {
      const timeout = setTimeout(() => {
        router.push("/")
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [orderId, orderNumber, router])

  if (!orderId || !orderNumber) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Redirecting to homepage...</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-xl text-muted-foreground">Thank you for shopping with Studo.ps</p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-center">Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
                <p className="text-3xl font-bold text-primary mb-3">{orderNumber}</p>
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ IMPORTANT: Save This Number!</p>
                  <p className="text-xs text-yellow-700">
                    Write down or screenshot this order number. You'll need it to track your order status.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">We've received your order</h3>
                    <p className="text-sm text-muted-foreground">
                      Your order has been placed successfully and is now being processed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">What happens next?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team will contact you via WhatsApp to confirm your order details and delivery arrangements.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discount Code Reward - Only show if earned */}
          {discountCode && discountPercentage && (
            <Card className="mb-6 border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardHeader className="bg-green-100/50 border-b-2 border-green-500">
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Gift className="w-6 h-6 text-green-600" />
                  <span className="text-green-800">🎉 Congratulations! You Earned a Discount Code!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-800 mb-2">
                    {discountPercentage}% OFF Your Next Purchase!
                  </p>
                  <p className="text-sm text-green-700 mb-4">
                    Because you spent more than ₪
                    {discountPercentage === "15" ? "1000" : discountPercentage === "10" ? "500" : "250"}, we're giving
                    you a special reward!
                  </p>

                  {/* Discount Code Display */}
                  <div className="bg-white border-3 border-green-500 rounded-lg p-6 mb-4 shadow-inner">
                    <p className="text-sm text-muted-foreground mb-2">Your Discount Code:</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <code className="text-3xl md:text-4xl font-bold text-green-600 tracking-wider px-4 py-2 bg-green-50 rounded border-2 border-green-300">
                        {discountCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-green-500 hover:bg-green-100"
                        onClick={() => {
                          navigator.clipboard.writeText(discountCode)
                          setCopiedCode(true)
                          setTimeout(() => setCopiedCode(false), 2000)
                        }}
                        title="Copy code"
                      >
                        {copiedCode ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-green-600" />
                        )}
                      </Button>
                    </div>
                    {copiedCode && <p className="text-sm text-green-600 font-medium">✓ Copied to clipboard!</p>}
                  </div>

                  {/* Important Instructions */}
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 text-left">
                    <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <span>⚠️</span> Important - Please Read:
                    </p>
                    <ul className="text-sm text-amber-800 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>
                          <strong>Save this code!</strong> Write it down or screenshot this page
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>
                          <strong>Single-use only:</strong> Can be used ONE time on your next order
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>
                          <strong>Valid for 90 days</strong> from today
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>
                          Enter this code at checkout to get {discountPercentage}% off your order
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>
                          <strong className="text-red-700">Once used, this code expires immediately</strong>
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Incentive Message */}
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      💡 <strong>Pro Tip:</strong> Keep shopping with Studo.ps to earn more discount codes! Higher
                      purchases = bigger discounts!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Information */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">📱</span>
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Please keep your WhatsApp available for order confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You will receive updates about your order status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Payment is cash on delivery - pay when you receive your order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>If you chose pickup, we'll notify you when your order is ready</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/track-order">
                <Package className="w-5 h-5 mr-2" />
                Track Order
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/shop">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Support */}
          <div className="text-center mt-8 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Need help with your order?</p>
            <p className="font-medium">
              Contact us on WhatsApp: <span className="text-primary">+972 59-976-5211</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
