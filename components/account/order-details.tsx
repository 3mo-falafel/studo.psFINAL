import Image from "next/image"
import Link from "next/link"
import { Package, MapPin, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { Order, OrderItem } from "@/lib/types/database"

interface OrderDetailsProps {
  order: Order
  orderItems: OrderItem[]
}

export function OrderDetails({ order, orderItems }: OrderDetailsProps) {
  const shippingAddress = order.shipping_address as any

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{order.order_number}</h2>
                <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-sm">
                  {order.status}
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
              <p className="text-3xl font-bold">Rs. {order.total.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{shippingAddress?.full_name}</p>
            <p className="text-muted-foreground">{shippingAddress?.address_line1}</p>
            {shippingAddress?.address_line2 && <p className="text-muted-foreground">{shippingAddress.address_line2}</p>}
            <p className="text-muted-foreground">
              {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postal_code}
            </p>
            <p className="text-muted-foreground">{shippingAddress?.country}</p>
            <p className="text-muted-foreground pt-2">{shippingAddress?.phone}</p>
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
              <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="text-xs">
                {order.payment_status}
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
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                <p className="text-sm text-muted-foreground">Price: Rs. {item.price.toLocaleString()}</p>
              </div>

              <div className="text-right">
                <p className="font-bold">Rs. {item.total.toLocaleString()}</p>
              </div>
            </div>
          ))}

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {order.shipping_cost === 0 ? "FREE" : `Rs. ${order.shipping_cost.toLocaleString()}`}
              </span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">Rs. {order.tax.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>Rs. {order.total.toLocaleString()}</span>
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

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
