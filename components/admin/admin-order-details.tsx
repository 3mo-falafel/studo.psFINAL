"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Package, MapPin, CreditCard, User, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils/currency"
import type { Order, OrderItem, User as DBUser } from "@/lib/types/database"

interface AdminOrderDetailsProps {
  order: Order
  orderItems: OrderItem[]
  customer: DBUser | null
}

export function AdminOrderDetails({ order, orderItems, customer }: AdminOrderDetailsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [isUpdating, setIsUpdating] = useState(false)

  const shippingAddress = order.shipping_address as any

  const handleStatusUpdate = async (field: "status" | "payment_status", value: string) => {
    setIsUpdating(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", order.id)

      if (error) throw error

      if (field === "status") {
        setStatus(value)
      } else {
        setPaymentStatus(value)
      }

      toast({
        title: "Order updated",
        description: `Order ${field.replace("_", " ")} has been updated successfully.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Manage order information and status</p>
        </div>
      </div>

      {/* Order Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{order.order_number}</h2>
                <Badge variant={status === "delivered" ? "default" : "secondary"} className="text-sm">
                  {status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Order Total</p>
              <p className="text-3xl font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Order Status</label>
              <Select
                value={status}
                onValueChange={(value) => handleStatusUpdate("status", value)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Payment Status</label>
              <Select
                value={paymentStatus}
                onValueChange={(value) => handleStatusUpdate("payment_status", value)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        {customer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{customer.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Customer Since</p>
                <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Customer Name</p>
              <p className="font-medium">{shippingAddress?.full_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">WhatsApp Number</p>
              <p className="font-medium">{shippingAddress?.whatsapp || shippingAddress?.phone || "N/A"}</p>
            </div>
            {order.delivery_method && (
              <div>
                <p className="text-muted-foreground mb-1">Delivery Method</p>
                <Badge variant="outline" className="text-xs capitalize">
                  {order.delivery_method === "birzeit"
                    ? "Pickup from Birzeit University"
                    : order.delivery_method === "billin"
                      ? "Pickup from Billin Village"
                      : "Home Delivery"}
                </Badge>
              </div>
            )}
            <Separator />
            <div>
              <p className="text-muted-foreground mb-1">Address</p>
              <p className="text-sm">{shippingAddress?.address_line1}</p>
              {shippingAddress?.address_line2 && <p className="text-sm">{shippingAddress.address_line2}</p>}
              <p className="text-sm">
                {shippingAddress?.city}, {shippingAddress?.state}
              </p>
              <p className="text-sm">{shippingAddress?.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge variant={paymentStatus === "paid" ? "default" : "secondary"} className="text-xs">
                {paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({orderItems.length})
          </CardTitle>
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
                <p className="text-sm text-muted-foreground">Product ID: {item.product_id}</p>
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
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">{order.shipping_cost === 0 ? "FREE" : formatPrice(order.shipping_cost)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
