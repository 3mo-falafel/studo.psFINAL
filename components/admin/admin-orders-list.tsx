"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils/currency"
import type { Order } from "@/lib/types/database"

interface AdminOrdersListProps {
  orders: Order[]
}

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  const { toast } = useToast()
  const router = useRouter()

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Status updated",
      description: "Order status has been updated successfully.",
    })

    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{order.order_number}</h3>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                      {order.delivery_method && (
                        <Badge variant="outline" className="text-xs">
                          {order.delivery_method === "birzeit"
                            ? "Birzeit"
                            : order.delivery_method === "billin"
                              ? "Billin"
                              : "Home"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment: <span className="capitalize">{order.payment_status}</span> •{" "}
                      <span className="capitalize">{order.payment_method}</span>
                    </p>
                    {order.shipping_address && (order.shipping_address as any).whatsapp && (
                      <p className="text-sm text-primary">📱 {(order.shipping_address as any).whatsapp}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                    </div>

                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                      <SelectTrigger className="w-40">
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

                    <Button variant="outline" asChild>
                      <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
