"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils/currency"
import Image from "next/image"

interface Order {
  id: string
  order_number: string
  status: string
  created_at: string
  total: number
  shipping_cost: number
  subtotal: number
  payment_status: string
  payment_method: string
  delivery_method?: string
  shipping_address: any
  notes?: string
}

interface OrderItem {
  id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
  total: number
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)
    setOrderItems([])

    try {
      const supabase = getSupabaseBrowserClient()

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim().toUpperCase())
        .single()

      if (orderError || !orderData) {
        setError("Order not found. Please check your order number and try again.")
        setLoading(false)
        return
      }

      // Fetch order items
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id)
        .order("created_at", { ascending: true })

      setOrder(orderData)
      setOrderItems(itemsData || [])
    } catch (err) {
      console.error("Error fetching order:", err)
      setError("An error occurred while searching for your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />
      case "processing":
        return <Package className="w-6 h-6 text-blue-600" />
      case "shipped":
        return <Truck className="w-6 h-6 text-purple-600" />
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Package className="w-6 h-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDeliveryMethodText = (method?: string) => {
    switch (method) {
      case "birzeit":
        return "Pickup from Birzeit University"
      case "billin":
        return "Pickup from Billin Village"
      case "home":
        return "Home Delivery"
      default:
        return "Standard Delivery"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order number to see the current status</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber" className="text-base">
                    Order Number
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Example: STUDO-123456 (6 digits after STUDO-)
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="orderNumber"
                      placeholder="STUDO-123456"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                      className="text-lg"
                      disabled={loading}
                    />
                    <Button type="submit" size="lg" disabled={loading}>
                      <Search className="w-5 h-5 mr-2" />
                      {loading ? "Searching..." : "Track"}
                    </Button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Results */}
          {order && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <p className={`text-xl font-bold px-3 py-1 rounded-full border-2 inline-block ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="text-xl font-bold text-primary">{order.order_number}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    <p className="font-semibold">Order Progress:</p>
                    <div className="grid grid-cols-5 gap-2">
                      {["pending", "processing", "shipped", "delivered"].map((status, index) => {
                        const isActive = order.status === status
                        const isPassed =
                          ["pending", "processing", "shipped", "delivered"].indexOf(order.status) >= index
                        const isCancelled = order.status === "cancelled"

                        return (
                          <div key={status} className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                isCancelled
                                  ? "bg-red-100 border-red-300"
                                  : isActive
                                    ? "bg-primary text-white border-primary"
                                    : isPassed
                                      ? "bg-green-100 border-green-500"
                                      : "bg-gray-100 border-gray-300"
                              }`}
                            >
                              {status === "pending" && <Clock className="w-6 h-6" />}
                              {status === "processing" && <Package className="w-6 h-6" />}
                              {status === "shipped" && <Truck className="w-6 h-6" />}
                              {status === "delivered" && <CheckCircle className="w-6 h-6" />}
                            </div>
                            <p className="text-xs mt-2 text-center capitalize">{status}</p>
                          </div>
                        )
                      })}

                      {order.status === "cancelled" && (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-red-100 border-red-500">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <p className="text-xs mt-2 text-center">Cancelled</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order Date</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status</p>
                      <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium capitalize">{order.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Delivery Method</p>
                      <p className="font-medium">{getDeliveryMethodText(order.delivery_method)}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Address */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold">Delivery Address</p>
                    </div>
                    <div className="ml-6 text-sm space-y-1">
                      <p className="font-medium">{order.shipping_address.full_name}</p>
                      <p className="text-muted-foreground">{order.shipping_address.address_line1}</p>
                      {order.shipping_address.address_line2 && (
                        <p className="text-muted-foreground">{order.shipping_address.address_line2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {order.shipping_address.city}, {order.shipping_address.state}
                      </p>
                      {order.shipping_address.whatsapp && (
                        <p className="text-muted-foreground">📱 {order.shipping_address.whatsapp}</p>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="font-semibold mb-1">Order Notes</p>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({orderItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 line-clamp-2">{item.product_name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">Price: {formatPrice(item.price)}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">{formatPrice(item.total)}</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {order.shipping_cost === 0 ? "FREE" : formatPrice(order.shipping_cost)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you have any questions about your order, please contact us:
                  </p>
                  <p className="text-sm font-medium">
                    WhatsApp: <span className="text-primary">+972 59-976-5211</span>
                  </p>
                  <p className="text-sm font-medium">
                    Email: <span className="text-primary">jibreel@studo.ps</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Initial Instructions */}
          {!order && !error && !loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Track Your Order</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter your order number above to see your order status and details
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <p className="text-sm font-semibold mb-2">Where to find your order number:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Check your order confirmation page</li>
                      <li>Look for STUDO-XXXXXX format (6 digits)</li>
                      <li>Example: STUDO-123456</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
