import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminOrdersList } from "@/components/admin/admin-orders-list"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminOrdersPage() {
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

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <AdminOrdersList orders={orders || []} />
        </main>
      </div>
    </div>
  )
}
