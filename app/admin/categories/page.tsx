import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { CategoriesManager } from "@/components/admin/categories-manager"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserWithRole } from "@/lib/supabase/user-utils"

export default async function AdminCategoriesPage() {
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

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-8 bg-muted/30">
          <CategoriesManager categories={categories || []} />
        </main>
      </div>
    </div>
  )
}
