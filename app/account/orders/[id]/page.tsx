import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { OrderDetails } from "@/components/account/order-details"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch order
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!order) {
    notFound()
  }

  // Fetch order items
  const { data: orderItems } = await supabase.from("order_items").select("*").eq("order_id", order.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Order Details</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <AccountSidebar />
            </aside>

            <div className="lg:col-span-3">
              <OrderDetails order={order} orderItems={orderItems || []} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
