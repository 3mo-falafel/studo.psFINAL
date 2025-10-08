import Link from "next/link"
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types/database"

interface AdminOverviewProps {
  stats: {
    totalProducts: number
    totalOrders: number
    totalUsers: number
    totalRevenue: number
  }
  recentOrders: Order[]
}

export function AdminOverview({ stats, recentOrders }: AdminOverviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                    <p className="font-semibold">Rs. {order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
