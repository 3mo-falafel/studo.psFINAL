import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { AddressesList } from "@/components/account/addresses-list"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function AddressesPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">My Addresses</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <AccountSidebar />
            </aside>

            <div className="lg:col-span-3">
              <AddressesList addresses={addresses || []} userId={user.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
