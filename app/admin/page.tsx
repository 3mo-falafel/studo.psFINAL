import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOverview } from "@/components/admin/admin-overview"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { isAdmin } = await getUserWithRole(supabase, user.id, user.email!, user.user_metadata)

  if (!isAdmin) {
    redirect("/")
  }

  // Fetch dashboard stats
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: orders } = await supabase.from("orders").select("total")

  const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <AdminOverview
            stats={{
              totalProducts: totalProducts || 0,
              totalOrders: totalOrders || 0,
              totalUsers: totalUsers || 0,
              totalRevenue,
            }}
            recentOrders={recentOrders || []}
          />
        </main>
      </div>
    </div>
  )
}
