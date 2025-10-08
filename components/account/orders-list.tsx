import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types/database"

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">You haven't placed any orders yet</p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{order.order_number}</h3>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payment: <span className="capitalize">{order.payment_status}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">Rs. {order.total.toLocaleString()}</p>
                </div>
                <Button asChild>
                  <Link href={`/account/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
