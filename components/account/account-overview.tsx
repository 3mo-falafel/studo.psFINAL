import Link from "next/link"
import { Package, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@supabase/supabase-js"
import type { Order } from "@/lib/types/database"

interface AccountOverviewProps {
  user: User
  userData: any
  orders: Order[]
}

export function AccountOverview({ user, userData, orders }: AccountOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>مرحباً بعودتك، {userData?.full_name || user.email}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة حسابك، طلباتك، وإعداداتك من هنا</p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/account/addresses">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إدارة</p>
                  <p className="font-semibold">العناوين</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wishlist">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عرض</p>
                  <p className="font-semibold">المفضلة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">عرض الكل</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("ar-PS", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">₪ {order.total.toLocaleString()}</p>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="mt-1">
                        {order.status === "delivered" ? "تم التوصيل" : 
                         order.status === "shipped" ? "قيد الشحن" :
                         order.status === "processing" ? "قيد المعالجة" : 
                         order.status === "pending" ? "قيد الانتظار" : order.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">لم تقم بأي طلبات بعد</p>
              <Button asChild>
                <Link href="/shop">ابدأ التسوق</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
