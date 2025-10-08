import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOrderDetails } from "@/components/admin/admin-order-details"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
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

  // Fetch order
  const { data: order } = await supabase.from("orders").select("*").eq("id", params.id).maybeSingle()

  if (!order) {
    notFound()
  }

  // Fetch order items
  const { data: orderItems } = await supabase.from("order_items").select("*").eq("order_id", order.id)

  // Fetch customer info if order has user_id
  let customer = null
  if (order.user_id) {
    const { data } = await supabase.from("users").select("*").eq("id", order.user_id).maybeSingle()
    customer = data
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <AdminOrderDetails order={order} orderItems={orderItems || []} customer={customer} />
        </main>
      </div>
    </div>
  )
}
