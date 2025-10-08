import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AccountOverview } from "@/components/account/account-overview"
import { AccountHeader } from "@/components/account/account-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ensureUserProfile } from "@/lib/supabase/user-utils"

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Ensure user profile exists and fetch user data
  const userData = await ensureUserProfile(supabase, user.id, user.email!, user.user_metadata)

  // Fetch recent orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <AccountHeader />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <AccountSidebar />
            </aside>

            <div className="lg:col-span-3">
              <AccountOverview user={user} userData={userData} orders={orders || []} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
