import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { BannersManager } from "@/components/admin/banners-manager"
import { redirect } from "next/navigation"

export default async function AdminBannersPage() {
  const supabase = await getSupabaseServerClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch banners
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("banner_slot", { ascending: true })
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Promotional Banners</h1>
              <p className="text-muted-foreground">
                Manage promotional banners organized in 3 slots. Add multiple offers per slot that rotate every 5 seconds.
              </p>
            </div>
            <BannersManager banners={banners || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
